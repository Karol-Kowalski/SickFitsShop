import useForm from '../lib/useForm';

export default function CreateProduct() {
  const { inputs, handleChange} = useForm({
    name: 'Nice Shoes',
    price: 3456,
    description: 'Wow!!!',
  });

  return (
    <form>
      <label htmlFor="name">
        Name
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          value={inputs.name}
          onChange={handleChange}
        />
      </label>
    </form>
  );
}
