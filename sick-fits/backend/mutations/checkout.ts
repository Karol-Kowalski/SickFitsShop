import { OrderCreateInput } from '../.keystone/schema-types';
/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';

async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Mke sure they are sign in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry! You must be signed in to create order')
  }
  // 1.1 QUery the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: `
      id
      name
      email
      cart
    `
  });
  console.log(user);
  // 2. calculate total price for their order

  // 3. create the payment with the stripe library
  // 4. Convert cartItems to OrderItems
  // 5. Create order and return it
}

export default checkout;
