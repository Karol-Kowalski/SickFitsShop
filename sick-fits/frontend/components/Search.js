import { resetIdCounter, useCombobox } from 'downshift';
import { DropDown, SearchStyles, DropDownItem } from './styles/DropDown';

export default function Search() {
  resetIdCounter();
  const { getMenuProps, getInputProps, getComboboxProps } = useCombobox({
    items: [],
    onInputValueChange() {
      console.log('InputChange');
    },
    onSelectedItemChange() {
      console.log('selected item change!');
    },
  });
  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search fo an Item',
            id: 'search',
            className: 'loading',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        <DropDownItem>hey</DropDownItem>
      </DropDown>
    </SearchStyles>
  );
}
