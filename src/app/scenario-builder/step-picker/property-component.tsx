import * as React from 'react';
import { ArrayProperty, SingularProperty, AbstractProperty } from '../../api';
import { ArrayPropertyComponent } from './array-property-component';
import { SingularPropertyComponent } from './singular-property-component';

export function PropertyComponent(props: {
  property: AbstractProperty;
  data: any;
  onTextChanged: ((_event: React.ChangeEvent<HTMLInputElement>) => void);
}) {
  return ((props.property as ArrayProperty).items)
    ?
    <ArrayPropertyComponent
      data={props.data}
      arrayProperty={props.property as ArrayProperty}
      onTextChanged={props.onTextChanged} />
    :
    <SingularPropertyComponent
      data={props.data}
      property={props.property as SingularProperty}
      onTextChanged={props.onTextChanged} />;
}
