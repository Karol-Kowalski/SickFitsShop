import { gql, useMutation } from '@apollo/client';
import styled from 'styled-components';

const Bigbutton = styled.div`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [remove, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
  });

  return (
    <Bigbutton
      type="button"
      disabled={loading}
      onClick={remove}
      title="Remove This Item from Cart"
    >
      &times;
    </Bigbutton>
  );
}
