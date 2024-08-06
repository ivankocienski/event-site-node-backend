import express from 'express';
import fs from 'fs';
import cors from 'cors';

function strcmp(a: string, b: string) {
  if(a < b) return -1;
  if(a > b) return 1;

  return 0;
}

const app = express();
app.use(cors());

let partners: Record<string, any> = {};
let events: any[] = [];

app.get('/', (req, res) => {
  const payload = {
    status: 'functional',
    eventCount: events.length,
    partnerCount: Object.keys(partners).length
  };

  res.send(payload);
});

app.get('/partners', (req, res) => {
  const foundPartners = Object
    .values(partners)
    .map( a => { return {
      name: a.name,
      id: a.id,
      summary: a.summary,

    }; })
    .sort( (a, b) => strcmp(a.name, b.name) )

  res.send(foundPartners);
});

function eventSummary(e: any) {
  return {
    id: e.id,
    summary: e.summary,
    startDate: e.startDate,
    organizer: { id: e.organizer.id }
  };
}

app.get('/partners/:id', (req, res) => {
  const findId: string | undefined = req.params.id;

  if(findId) {
    let foundPartner = partners[findId];
    if(foundPartner) {

      foundPartner.events = events
        .filter( e => e.organizer.id === findId)
        .map(eventSummary);

      res.send(foundPartner);

    } else {
      res.status(404).send("partner not found");
    }

  } else {
    res.status(401).send("bad or missing ID");
  }
});

app.get('/events', (req, res) => {
  const eventSummaries = events
    .map(eventSummary);

  res.send(eventSummaries);
});

app.get('/events/:id', (req, res) => {
  const findId: string | undefined = req.params.id;

  if(findId) {
    const foundEvent = events.find( e => e.id == findId);
    if(foundEvent) {
      res.send(foundEvent);

    } else {
      res.status(404).send("event not found");
    }

  } else {
    res.status(401).send("bad or missing ID");
  }
});

//
//
//

async function loadPartners(): Promise<any[]> {
  const rawData = fs.readFileSync("./output/partners.json", { encoding: 'utf-8'});
  const data = JSON.parse(rawData);

  return data.data.partnersByTag.reduce(
    (collection: any, partner: any) => {
      collection[partner.id] = partner;
      return collection;
    },
    {});
}

async function loadEvents(): Promise<any[]> {
  const rawData = fs.readFileSync("./output/events.json", { encoding: 'utf-8'});
  const data = JSON.parse(rawData);

  return data
    .data
    .eventsByFilter
    .map( (e: any) => {
      return {
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate)
      }
    });
}

async function main() {
  partners = await loadPartners();
  console.log(`loaded ${Object.keys(partners).length} partners`);

  events = await loadEvents();
  console.log(`loaded ${events.length} events`);

  app.listen(8001, () => {
    console.log("running @ http://localhost:8001/");
  });
}

main();