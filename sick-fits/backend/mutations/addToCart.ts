/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';

import { CartItemCreateInput } from '../.keystone/schema-types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('Adding to Cart!');
  // 1. query the currwnt user see if it they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity',
  });
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(
      `This item already ${existingCartItem.quantity}, increment by 1!`
    );
    // 3. see if the current item is in their cart
    // 3.1 if itis, increment by 1
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // 3.2 if it isn't, create a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    }
  })
}

export default addToCart;
