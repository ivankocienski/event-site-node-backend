import axios from 'axios';
import fs from 'fs';

/* const articlesQuery = `
    query { articleConnection { edges {
        node {
          articleBody
          datePublished
          headline
          providers { id }
          image
    } } } }
  `;

  const partnersQuery = `
    query { partnersByTag(tagId: 3) {
      id
      name
      description
      summary
      contact { email, telephone }
      url
      address { streetAddress, postalCode }
      logo
    } }
  `;
*/


async function main() {
  const url = "https://placecal.org/api/v1/graphql";
  const query = `
    query { eventsByFilter(tagId: 3, fromDate: "2023-03-01 00:00", toDate: "2025-01-01 00:00") {
      id
      name
      description
      summary
      startDate
      endDate
      publisherUrl
      address { streetAddress, postalCode }
      organizer { id }
    } }
  `;

  try {
    const response = await axios.post(url, { query: query });
    //console.log(response);

    if(response.status != 200) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.data;
    //console.log(data.data.articleConnection.edges);
    //console.log(JSON.stringify(data));

    const path = "./output/events.json";
    fs.writeFileSync(path, JSON.stringify(data));

  } catch(error) {
    console.error(error);
  }
}

main();