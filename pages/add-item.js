// pages/add-item.js
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const ADD_ITEM = gql`
  mutation AddItem($name: String!, $description: String!) {
    addItem(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export default function AddItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [addItem, { data, loading, error }] = useMutation(ADD_ITEM);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem({ variables: { name, description } });
  };

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Add Item</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Item</button>
      </form>
      {data && <p>Item added: {data.addItem.name}</p>}
    </div>
  );
}