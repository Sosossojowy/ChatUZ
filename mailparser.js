require('dotenv').config();
const { ImapFlow } = require('imapflow');
const { simpleParser } = require('mailparser');
const fs = require('fs');

const DATA_FILE = 'data.json';
const RECONNECT_INTERVAL = 1000; // 10 sekund

const dopiszDoPliku = (nowyPromotor) => {
    let baza = { promotorzy: [] };

    if (fs.existsSync(DATA_FILE)) {
        const dane = fs.readFileSync(DATA_FILE, 'utf-8');
        try {
            baza = JSON.parse(dane);
        } catch (err) {
            console.error('Niepoprawny JSON, tworzę nowy plik.');
        }
    }

    baza.promotorzy.push(nowyPromotor);
    fs.writeFileSync(DATA_FILE, JSON.stringify(baza, null, 2), 'utf-8');
};

async function startListener() {
    const client = new ImapFlow({
        host: 'imap.poczta.onet.pl',
        port: 993,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await client.connect();
        await client.mailboxOpen('INBOX');
        console.log(`[${new Date().toISOString()}] Połączono z IMAP. Nasłuchiwanie wiadomości...`);

        client.on('exists', async () => {
            const unseen = await client.search({ seen: false });
            
            for (const uid of unseen.reverse()) {
                const wiadomość = await client.fetchOne(uid, { source: true, envelope: true });
                
                const parsed = await simpleParser(wiadomość.source);

                const temat = (wiadomość.envelope.subject || '').trim().toLowerCase();
                const nadawca = (wiadomość.envelope.from[0]?.address || '').toLowerCase();

                if (!nadawca.endsWith('@gmail.com')) return;
                if (temat !== 'propozycja tematów') return;

                const linie = parsed.text
                    .split('\n')
                    .map(l => l.trim())
                    .filter(Boolean);

                const imieNazwiskoLine = linie.find(line => line.toLowerCase().startsWith("imie nazwisko:"));
                const tematLines = linie.filter(line => line.toLowerCase().startsWith("temat:"));
        
                if (!imieNazwiskoLine || tematLines.length === 0) {
                    console.log("Nieprawidłowy format wiadomości.");
                    return;
                }

                const imieNazwisko = imieNazwiskoLine.split(':')[1]?.trim() || '';
                const [imie, ...nazParts] = imieNazwisko.split(' ');
                const nazwisko = nazParts.join(' ');

                const tematy = tematLines.map(l => l.split(':')[1]?.trim()).filter(Boolean);

                const nowyPromotor = {
                    imie,
                    nazwisko,
                    tematy
                };

                dopiszDoPliku(nowyPromotor);

                console.log("Dodano promotora:", nowyPromotor);
                await client.messageFlagsAdd(uid, ['\\Seen']);
            }
        });

        client.on('close', () => {
            console.warn(" Połączenie z IMAP zostało zamknięte. Próba ponownego połączenia za 10s...");
            setTimeout(startListener, RECONNECT_INTERVAL);
        });

        client.on('error', (err) => {
            console.error("Błąd klienta IMAP:", err.message);
            client.logout().catch(() => {});
            setTimeout(startListener, RECONNECT_INTERVAL);
        });

    } catch (err) {
        console.error("Krytyczny błąd:", err.message);
        setTimeout(startListener, RECONNECT_INTERVAL);
    }
}

// Startuje pierwszy raz
startListener();