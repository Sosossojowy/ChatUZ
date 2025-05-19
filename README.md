

///////////////////////////////////////

# Aplikacja Webowa - Przydział Tematu Pracy i Promotora

## Opis projektu

Aplikacja webowa ma na celu automatyczne dopasowanie tematu pracy inżynierskiej/magisterskiej oraz promotora do studenta na podstawie jego zakresu zainteresowań. System będzie wykorzystywał model sztucznej inteligencji (AI), który analizuje informacje dostarczone przez studenta i przypisuje odpowiedni temat oraz promotorów, którzy najlepiej odpowiadają jego zainteresowaniom.

##Cel

-Uproszczenie procesu wyboru tematu pracy i promotora.

### Funkcjonalności:

1. **Rejestracja Studenta**  
   - Student tworzy konto w systemie, podając swój adres e-mail akademicki.

2. **Wprowadzenie Zakresu Zainteresowań**  
   - Student wprowadza zakres swoich zainteresowań dotyczących tematyki pracy dyplomowej, który może zawierać słowa kluczowe, krótkie opisy, dziedziny wiedzy.

3. **Rejestracja Promotorów**  
   - Promotorzy rejestrują się w systemie, podając swoje dane (imię, nazwisko, tytuł naukowy, dziedziny specjalizacji oraz dostępność do przyjmowania studentów).

4. **Model AI do Dopasowywania**  
   - Na podstawie wprowadzonych danych (zakresu zainteresowań studenta oraz specjalizacji promotora) model AI analizuje i porównuje te informacje, aby zaproponować odpowiedni temat oraz promotora.
   - Model AI może wykorzystywać technologię NLP (Natural Language Processing) do analizy tekstu wprowadzonego przez studenta i promotora.

5. **Przydział Tematu i Promotora**  
   - Po analizie danych przez model, aplikacja sugeruje temat pracy oraz promotora, a student otrzymuje powiadomienie o przypisaniu.

6. **Możliwość Zatwierdzenia/Dopuszczenia Zmian**  
   - Student może zatwierdzić przydzielony temat i promotora lub złożyć prośbę o ponowne dopasowanie na podstawie nowych danych.

7. **Panel Administratora**  
   - Administratorzy mają dostęp do panelu, gdzie mogą zarządzać kontami studentów i promotorów, monitorować procesy dopasowywania tematów i promotorów oraz zatwierdzać przydziały.

## Technologie:

Aplikacja wykorzystuje technologie (React, Node.js, ChatGPT-4o Mini) do procesu przydziału tematów i promotorów. Używa NLP które trafnie dopasowuje dane, a przechowywanie ich
w pliku JSON upraszcza architekturę.

## Architektura systemu

System będzie składał się z trzech głównych warstw:

1. **Frontend:**  
   - Strona internetowa, na której studenci mogą wprowadzać swoje dane, zapoznać się z przydzielonymi tematami i promotorami, oraz zarządzać swoim profilem.

2. **Backend:**  
   - Serwer aplikacji, który obsługuje logikę biznesową, w tym proces dopasowywania tematów i promotorów, oraz komunikację z bazą danych.
   - API RESTful do komunikacji z frontendem.

3. **Model AI:**  
   - Model do analizy tekstu wprowadzonego przez studentów i promotorów, który będzie wykorzystywał Chat GPT 4o mini.

## Przebieg działania aplikacji

1. **Rejestracja studenta:**
   - Student wprowadza swoje dane, takie jak imię, nazwisko, adres e-mail, kierunek studiów i zakres zainteresowań.
   
2. **Rejestracja promotora:**
   - Promotor wprowadza dane dotyczące swoich specjalizacji i dostępności.
   
3. **Model AI dobiera temat i promotora:**
   - Na podstawie wprowadzonego zakresu zainteresowań studenta oraz specjalizacji promotora, model AI przetwarza tekst i dokonuje rekomendacji.
   
4. **Przydział:**
   - Po analizie, student otrzymuje propozycję tematu i promotora. Może zatwierdzić lub poprosić o kolejne dopasowanie.

5. **Zatwierdzenie tematu i promotora:**
   - Student zatwierdza temat i promotora, a system powiadamia promotora o studencie.

6. **Panel administratora:**
   - Administratorzy mają możliwość monitorowania procesów rejestracji, przydzielania tematów i kontaktowania się z użytkownikami.

## Wymagania systemowe

- **Frontend:**  
  -javascript
  -css

- **Backend:**  
   -node.js

- **Baza danych:**
   -Pilk JSON

## Kosztorys
1. **Informacje ogólne**
   - Czas trwania projektu: 15 tygodni
   - Stawka wynagrodzeniowa: 5000 PLN brutto / miesiąc
   - Liczba osób pracujących nad projektem: 3 osoby
2. **Rozliczenie kosztów pracy**
   - **Przeliczenie wynagrodzenia**
      - 5000 PLN brutto / miesiąc
      - 5000 PLN / 4 tygodnie = 1250 PLN
      - 15 tygodni * 1250 PLN = 18 750 PLN (cena za osobę)
3. **Całkowity koszt projektu**
   - Suma całkowita: 18 750 PLN * 3 osoby = 56 250 PLN

## Użyteczność

- Aplikacja jest skierowana do studentów wyższych uczelni, którzy chcą otrzymać odpowiedni temat pracy inżynierskiej/magisterskiej oraz dopasowanego promotora w oparciu o swoje zainteresowania.
- Aplikacja jest również przydatna dla promotorów, którzy chcą zarejestrować swoje specjalizacje i wybrać odpowiednich studentów do współpracy.

## Harmonogram 
1. Przygotowanie projektu (3 tygodnie)
      - Analiza wymagań
2.Implementacja Frontendu	(2 tygodnie)
      - Stworzenie interfejsu użytkownika
      - Integracja z API
3. Implementacja Backendu	(2 tygodnie)
      - API RESTful
      - Logika przetwarzania danych JSON
4. Integracja z AI	(2 tygodnie)
      - Połączenie z OpenAI API
      - Implementacja dopasowań NLP
5. Testowanie	(2 tygodnie)
   	- Testy 
      - Poprawki
6. Wdrożenie	(1 tydzień)
      - Deploy aplikacji
      - Dokumentacja końcowa

