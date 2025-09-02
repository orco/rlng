# Running Lights - Sveriges mysigaste lopp

En modern webbplats för Running Lights löparevent i Alingsås, inspirerad av designen från Gotaleden Stafett & Ultra.

## Översikt

Denna webbplats är skapad för att marknadsföra Running Lights 2025 som äger rum den 11 oktober 2025 under Lights in Alingsås. Webbplatsen innehåller:

- **Nedräkningstimer** till eventet
- **Distanser och kategorier** (Knatteloppet, Energiloppet, Ungdomsloppet, Stafett, 5km, 10km)
- **Anmälningsinformation** och länkar
- **Kontaktformulär** och information
- **Responsiv design** för alla enheter
- **Modern, professionell design** inspirerad av Gotaleden

## Teknisk information

### Filer
- `index.html` - Huvudsidan med all innehåll
- `styles.css` - All styling och responsiv design
- `script.js` - JavaScript för interaktivitet och nedräkningstimer
- `rl2025.pdf` - Officiell informationsbroschyr för Running Lights 2025
- `deploy.sh` - Avancerat FTP-deploy script med synkronisering
- `deploy-safe.sh` - Säkert och robust FTP-deploy script (REKOMMENDERAS)
- `deploy-simple.sh` - Enkelt FTP-deploy script
- `README.md` - Denna fil

### Funktioner
- **Statisk webbplats** - Inga databaser eller server-side kod krävs
- **Responsiv design** - Fungerar på mobil, tablet och desktop
- **SEO-optimerad** - Semantisk HTML och meta-tags
- **Tillgänglighetsanpassad** - ARIA-labels och keyboard navigation
- **Performance-optimerad** - Minimal kod och snabba laddningstider

## Hosting på one.com

### Steg-för-steg instruktioner:

1. **Logga in på one.com**
   - Gå till din one.com kontrollpanel
   - Välj din domän (runninglights.se)

2. **Öppna Filhanteraren**
   - Klicka på "Filhanterare" eller "File Manager"
   - Navigera till `public_html` mappen

3. **Ladda upp filer**
   - Ta bort eventuella befintliga filer i `public_html`
   - Ladda upp följande filer:
     - `index.html`
     - `styles.css`
     - `script.js`
     - `rl2025.pdf`

4. **Kontrollera filrättigheter**
   - Se till att filerna har rätt rättigheter (644 för filer)
   - HTML-filen ska vara i root-katalogen (`public_html`)

5. **Testa webbplatsen**
   - Besök https://runninglights.se
   - Kontrollera att alla funktioner fungerar

### Viktiga noteringar för one.com:

- **Endast statiska filer** - Ingen PHP, databaser eller server-side kod
- **Standard HTML/CSS/JS** - Alla moderna webbläsare stöds
- **Filstorlek** - Alla filer är optimerade för snabb laddning
- **Mobilanpassad** - Responsiv design fungerar på alla enheter

## Anpassningar och uppdateringar

### Ändra event-datum:
```javascript
// I script.js, ändra denna rad:
const eventDate = new Date('2025-10-11T10:00:00').getTime();
```

### Uppdatera kontaktuppgifter:
```html
<!-- I index.html, hitta contact-section och uppdatera: -->
<p>Lövekullevägen 21, 441 44 Alingsås, Sweden</p>
<p>+46 (0) 709 71 19 06</p>
<p>info@runninglights.se</p>
```

### Lägga till/ändra distanser:
```html
<!-- I index.html, hitta distances-grid och lägg till/ändra: -->
<div class="distance-card">
    <h3>Ny distans</h3>
    <p>Beskrivning</p>
</div>
```

## Designelement

### Färgschema:
- **Primärfärg:** #ffd700 (Guld)
- **Sekundärfärg:** #1a1a1a (Mörk grå)
- **Accentfärg:** #ffed4a (Ljus guld)
- **Text:** #333333 (Mörkgrå)
- **Bakgrund:** #ffffff (Vit)

### Typografi:
- **Font:** Arial, sans-serif
- **Rubriker:** Bold, stora storlekar
- **Brödtext:** Normal vikt, läsbar storlek
- **Knappar:** Bold, kontrastrika

### Funktioner:
- **Nedräkningstimer:** Uppdateras varje sekund
- **Smooth scrolling:** Mjuk navigering mellan sektioner
- **Mobilmeny:** Hamburger-meny för mobila enheter
- **Hover-effekter:** Interaktiva element
- **Formulärvalidering:** Realtidsvalidering av formulär

## Support och underhåll

### Vanliga problem:

1. **Nedräkningstimern visar fel tid:**
   - Kontrollera att datum är korrekt i script.js
   - Se till att JavaScript är aktiverat i webbläsaren

2. **Mobilmenyn fungerar inte:**
   - Kontrollera att script.js laddas korrekt
   - Testa i olika webbläsare

3. **Formulär skickas inte:**
   - Formulären är för närvarande mockade
   - Implementera backend-lösning vid behov

### Framtida förbättringar:
- Lägg till bildgalleri från tidigare event
- Integrera med anmälningssystem
- Lägg till Google Maps för rutt-visualisering
- Implementera nyhetsbrev-funktionalitet
- Lägg till sociala medier-integration

## Kontakt

För teknisk support eller frågor om webbplatsen:
- **E-post:** info@runninglights.se
- **Telefon:** +46 (0) 709 71 19 06

---

## Automatisk Deploy

### FTP-Deploy Scripts

Projektet innehåller tre deploy-script för att ladda upp webbplatsen till ftp.chol.se:

#### 1. Avancerat Script (`deploy.sh`)
**Rekommenderas** - Använder `lftp` för intelligent synkronisering:

```bash
./deploy.sh
```

**Fördelar:**
- ✅ Laddar endast upp ändrade filer
- ✅ Tar bort filer som inte längre finns lokalt
- ✅ Robust felhantering
- ✅ Detaljerad progress-information
- ✅ Automatisk installation av lftp om det saknas

#### 2. Säkert Script (`deploy-safe.sh`) ⭐ REKOMMENDERAS
Robust och säker version som alltid fungerar:

```bash
./deploy-safe.sh
```

**Fördelar:**
- ✅ Enkel och pålitlig
- ✅ Robust felhantering
- ✅ Laddar upp alla viktiga filer
- ✅ Fungerar även om katalogen redan finns
- ✅ Inga komplexa regex eller synkronisering

#### 3. Enkelt Script (`deploy-simple.sh`)
Använder standard `ftp`-klient (finns på alla system):

```bash
./deploy-simple.sh
```

**Fördelar:**
- ✅ Fungerar utan extra paket
- ✅ Enkel och pålitlig
- ❌ Laddar upp alla filer varje gång

### Användning:

1. **Kör deploy-scriptet:**
   ```bash
   cd /path/to/rlng
   ./deploy.sh
   ```

2. **Ange FTP-uppgifter:**
   - Användarnamn för chol.se
   - Lösenord (visas inte när du skriver)

3. **Vänta på uppladdning:**
   - Scriptet skapar automatiskt `/rlng` mappen
   - Laddar upp alla webbfiler
   - Visar progress och resultat

### Felsökning Deploy:

**Problem:** "lftp: command not found"
- **Lösning:** Kör `deploy-simple.sh` istället eller installera lftp manuellt

**Problem:** "Permission denied"
- **Lösning:** Kontrollera FTP-uppgifter och att kontot har skrivbehörighet

**Problem:** "Connection failed"
- **Lösning:** Kontrollera internetanslutning och att ftp.chol.se är tillgängligt

---

*Skapad för Running Lights 2025 - Sveriges mysigaste lopp!* 🏃‍♂️🏃‍♀️
