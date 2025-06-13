imiona= [`imie nazwisko: Jacek Kuczak

    temat: psychologia

    temat:nauka polskiego`]

const linie = imiona[0]
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
console.log(linie)
linie.forEach(element => {
    console.log(element)
});