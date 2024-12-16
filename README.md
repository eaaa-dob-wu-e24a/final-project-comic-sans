# Eventually: Planlægningsapp

## Features
- Opret et event
- Del event gennem links & QR koder
- Stem på et event
- Se overblik af dine events, og deltagende events på Dashboard
- Sæt endelige startstidspunkt for et event du ejer
- Opdater brugerprofil inkl. profilbillede.

## Stack
![Frame 632668](https://github.com/user-attachments/assets/388c8e89-d2cd-4a82-8b20-980295e41eb2)

Backend:
- PHP

Database
- SQL

Frontend 1:
- React & NextJS

Frontend 2:
- HTML / CSS / JS
- 
### Backend:

PHP & SQL

### Frontend 1:

React & NextJS

### Frontend 2:

HTML/JS

## Kør projektet

1. .env filer:

.env fil i /frontend/eventually/
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

.env fil i /backend/

```
DB_HOST=****
DB_NAME=****
DB_USER=****
DB_PASSWORD=****
```

2. Installation:

/frontend/eventually/

```sh
npm install
```

3. Kør projektet lokalt:

/backend/

```sh
php -S localhost:4000
```

/frontend/eventually/

```sh
npm run dev
```

/frontend/qr/

```sh
php -S localhost:3001
```

Tilgås på http://localhost:3000
