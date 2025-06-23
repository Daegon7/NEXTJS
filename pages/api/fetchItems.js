// pages/api/fetchItems.js
export default async function handler(req, res) {
  const graphqlQuery = {
    query: `
      query {
        items {
          id
          name
          description
        }
      }
    `,
  };

  try {
    const response = await fetch('http://localhost:3000/api/graphql2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphqlQuery),
    });

    const data = await response.json();
    res.status(200).json(data); // 그대로 응답
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from GraphQL server' });
  }
}