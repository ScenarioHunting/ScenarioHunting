import * as React from 'react';
import { ArrayProperty, SingularProperty, AbstractProperty } from '../../api';
import { PropertyComponent } from './property-component';

export function ArrayPropertyComponent(props: {
  arrayProperty: ArrayProperty;
  data: any;
  onTextChanged: ((_event: React.ChangeEvent<HTMLInputElement>) => void);
}) {
  return <div style={{
    padding: '14px',
    width: '115px',

    borderStyle: 'solid',
    borderWidth: 'thin',
    borderColor: '#45454542',
    borderRadius: '1px'
  }}>
    {Array.isArray(props.arrayProperty.items) ?
      [
        (props.arrayProperty.items as AbstractProperty[]).map((item, i) => <PropertyComponent
          key={i}
          // data={props.data[i]}
          data={(item as SingularProperty).example}
          property={item as SingularProperty}
          onTextChanged={e => props.onTextChanged(e)} />
        )
      ] : <PropertyComponent
        data={props.data}
        property={props.arrayProperty.items as SingularProperty}
        onTextChanged={e => props.onTextChanged(e)} />}

  </div>;
}
