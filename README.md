# Eventually: Planlægningsapp

## Features

## Stack

### Backend:

PHP & SQL

### Frontend 1:

React & NextJS

### Frontend 2:

HTML/JS

## Kør projektet

For at teste på et lokalt udviklingsmiljø, skal både PHP og Node server køres samtidig på korrekte porte. Der kræves også en .env fil der gemmer information til databaseadgang, samt addressen som PHP-serveren køres

1. .env filer:

.env fil i /frontend/eventually/ - brug enten localhost på port 4000 til et lokalt udviklingsmiljø, eller addressen til hvor du hoster PHP API'et:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

.env fil i /backend/ - indsæt her dine adgangsdetaljer til din SQL database:

```
DB_HOST=****
DB_NAME=****
DB_USER=****
DB_PASSWORD=****
```

2. Installation:

alle de påkrævede pakker skal først installeres med node package manager fra /frontend/eventually/:

```sh
npm install
```

3. Kør projektet lokalt:

Følgende skal køres fra beckend mappen:

```sh
php -S localhost:4000
```

Følgende skal køres på frontend/eventually mappen:

```sh
npm run dev
```

Til sidst kan den anden frontend køres fra frontend/qr på en ledig port:

```sh
php -S localhost:3001
```

Herefter tilgås projektet gennem en browser på http://localhost:3000
