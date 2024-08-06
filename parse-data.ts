import fs from 'fs';

/* async function main() {
  const rawData = fs.readFileSync("./output/partners.json", { encoding: 'utf-8'});
  const data = JSON.parse(rawData);

  // console.log(data);
  const partners = data.data.partnersByTag.reduce(
    (collection: any, partner: any) => {
      collection[partner.id] = partner;
      return collection;
    },
    {});

  console.log(partners);
} */

async function main() {
  const rawData = fs.readFileSync("./output/events.json", { encoding: 'utf-8'});
  const data = JSON.parse(rawData);

  // console.log(data.data.eventsByFilter);
  const events = data
    .data
    .eventsByFilter
    .map( (e: any) => {
      return {
        ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate)
      }
    });

  console.log(events);
}


main();