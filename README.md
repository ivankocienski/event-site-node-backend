# Event site (node) backend

_WARNING_: Very rough around the edges

Is a very simple API for serving data about "events" in time from "partners".

Data is generously supplied by [PlaceCal](https://placecal.org).

## Requires
- node
- npm
- probably nvm

## Running
- clone repo
- `npm install`
- `ts-node event-downloader.ts`
- `ts-node server.ts`
- `curl http://localhost:8001`

## Endpoints

### `/`

Reads status of server

### `/partners`

Reads all partner data

### `/partners/:id`

Get info about one partner

### `/events`

Reads events from the current day onward by default, if supplied with `?fromDate=YYYY-MM-DD` then will return all events from that day onward.

If `?onDay=YYYY-MM-DD` is supplied will only return events on that day.

### `/events/:id`

Get info about specific event only.

