# Studio Frisina Ascone Modica — sito web (bozza)

Bozza del sito per lo studio di architettura di **Mauro Frisina** e **Emanuele Ascone Modica**
(Partinico, PA). Sito statico, senza dipendenze e senza build: si apre direttamente nel browser
o su qualsiasi hosting (Netlify, Vercel, Cloudflare Pages, Aruba, cPanel…).

---

## 1. Come vederlo

Doppio clic su `index.html` funziona. Per una resa identica alla produzione conviene servirlo
con un server locale (alcuni browser limitano le richieste da `file://`):

```bash
python -m http.server 8123
# poi apri http://localhost:8123
```

---

## 2. Pagine

| File | Contenuto |
|---|---|
| `index.html` | Hero full-screen, manifesto, 4 progetti in evidenza, invito inaugurazione con countdown, servizi, CTA |
| `progetti.html` | Archivio con filtri per **tipologia** e **stato** (realizzati / in corso) |
| `progetti/casa-del-carrubo.html` | Scheda progetto: dati tecnici, concept, galleria, progetto successivo |
| `progetti/palazzo-bellini.html` | Restauro, Palermo |
| `progetti/stazione-21.html` | Commerciale, Partinico |
| `progetti/uliveto.html` | Ospitalità, Scopello (in corso) |
| `progetti/studio-32.html` | Interior, Palermo |
| `progetti/villa-terralba.html` | Residenziale, Terrasini (in corso) |
| `studio.html` | Storia, filosofia, persone, nuova sede |
| `servizi.html` | 4 servizi dettagliati + metodo in 4 fasi |
| `contatti.html` | Recapiti, modulo di qualifica, mappa OpenStreetMap, privacy |

Asset: `assets/css/style.css` (design system), `assets/js/main.js` (interazioni), `assets/img/favicon.svg`.

---

## 3. Scelte di progetto

- **Effetto galleria**: griglia a 12 colonne con span asimmetrici, foto a piena larghezza,
  testi brevi e molta aria. Le schede progetto usano didascalie numerate come un catalogo.
- **Tipografia**: *Inter Tight* per i titoli (tracking negativo, pesi leggeri) e *Inter* per il
  testo — sans-serif rigorosi, nessun font decorativo.
- **Palette**: carta calda `#F3F1EC`, antracite `#17171A`, un solo accento terracotta usato
  pochissimo (punto nella barra inaugurazione). Blocchi scuri per l'invito e il footer.
- **Inaugurazione (event-driven)**: barra fissa in alto con data e link all'invito
  (chiudibile, la scelta resta salvata), blocco dedicato con **countdown live** e CTA per
  confermare la presenza. Il link `contatti.html?oggetto=inaugurazione` precompila il modulo.
- **Performance**: immagini Unsplash servite in `srcset` (3 larghezze) + `sizes`, `loading="lazy"`,
  `decoding="async"`, fade-in al caricamento, hero con `preload` e `fetchpriority="high"`.
  CSS e JS esterni, un solo file ciascuno, nessuna libreria. Font con `display=swap`.
- **Accessibilità**: skip link, `aria-current` sulla voce attiva, menu overlay con `aria-expanded`,
  focus visibile, contrasti verificati, rispetto di `prefers-reduced-motion`.
- **Mobile**: griglie che collassano a una colonna, menu a tutto schermo, filtri non sticky.

---

## 4. Cosa è provvisorio (da sostituire prima della pubblicazione)

### Identità
- **Nome del brand**: qui è usato *Frisina Ascone Modica — Architetti*. Alternative da valutare:
  **FAM Studio**, **Studio FAM**, **FSAM Architetti**, **Frisina Ascone Modica Architetti Associati**.
  Il nome compare in: `<title>`, header/footer, JSON-LD, meta Open Graph.
- **Logo**: monogramma geometrico provvisorio in SVG (inline nell'header + `assets/img/favicon.svg`).
  Da sostituire con il logo definitivo appena disponibile.
- **Dominio**: i canonical e gli URL Open Graph puntano a `https://www.frisinaasconemodica.it/`.
- **Credito di design**: «Design by marcellosalvia.it» nel footer di tutte le pagine
  (`class="footer__credit"`), con link a https://marcellosalvia.it.

### Contatti
- Email `studio@frisinaasconemodica.it` e PEC `studio@pec.it`: **segnaposto**.
- Telefono unico: `+39 335 266 125` (indicato dal committente).
- Sede: **Via Pietro Nenni 3, 90042 Borgetto (PA)** — usata in header, contatti, scheda studio,
  JSON-LD e mappa OpenStreetMap centrata su Borgetto.
- P. IVA nel footer è ancora `00000000000`.
- Social: link generici a Instagram / LinkedIn / Houzz.

### Inaugurazione
- Data usata: **sabato 12 dicembre 2026, ore 18:30**, con termine conferme al 30 novembre.
  Va cambiata in due punti: attributo `data-countdown` e testo del blocco (home + `studio.html`).

### Progetti
Le sei schede sono **segnaposto verosimili** (nomi, anni, superfici, committenti e testi sono
inventati per mostrare il layout). Vanno sostituite con progetti reali, oppure rimosse.
Immagini: foto Unsplash (licenza Unsplash, uso libero) usate come reference visive — **non sono
progetti dello studio** e vanno rimpiazzate con fotografie proprie.

### Contenuti verificati dal web (usati come base)
- Studio storicamente attivo a Partinico (PA), Via Sapienza 32 — oggi nuova sede a Borgetto;
  esperienza **oltre vent'anni**; team con
  architetti, ingegnere, geometra e geologo; progettazione residenziale, commerciale, uffici,
  B&B, interior, direzione lavori, pavimentazioni in resina, lavori "chiavi in mano".
- Emanuele Ascone Modica: iscritto all'**Ordine degli Architetti di Palermo n. 87041** (2007).
- Mauro Frisina: laurea magistrale in **Architettura e Ingegneria edile** (Università di Palermo),
  **BIM Specialist**. Il suo numero di albo non è pubblico: non è stato inserito.

---

## 5. Da completare

1. **Foto**: quelle dei due soci sono già inserite (`assets/img/emanuele-ascone-modica.jpg`,
   `assets/img/mauro-frisina.jpg`). Mancano le foto della nuova sede (oggi reference Unsplash).
   Le schede di ingegnere e geometra sono state rimosse su richiesta.
2. **Modulo contatti**: oggi compila una mail (`mailto:`). Per ricevere i messaggi serve un
   endpoint — es. Formspree, o una funzione serverless su Netlify/Cloudflare. Basta cambiare
   l'attributo `data-inquiry` in `contatti.html` con una `action` POST.
3. **Privacy**: l'informativa in `contatti.html#privacy` è un riassunto, non un testo legale.
   Serve cookie banner solo se si aggiungono analytics o embed di terze parti.
4. **Favicon/OG image** definitive e verifica dei meta su ogni pagina.
5. Mappa: valutare Google Maps embed solo se si accetta il consenso cookie; oggi è OSM (senza cookie).

---

## 6. Note tecniche

- Nessun framework, nessun build step, nessuna dipendenza npm.
- Il CSS è organizzato in 20 sezioni commentate (reset → token → componenti → utility).
- Le immagini remote si possono sostituire mettendo i file in `assets/img/` e cambiando i
  percorsi: gli attributi `srcset`/`sizes` sono già pronti per più formati.
- Per la produzione: attivare compressione Brotli/Gzip lato server e caching lungo sugli asset.
  Il sito non usa cookie; il solo storage è `localStorage` per ricordare la chiusura della barra.
