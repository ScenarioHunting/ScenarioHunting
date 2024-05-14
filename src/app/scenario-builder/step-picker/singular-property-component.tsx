import * as styles from './scenario-step-picker.style.css';
import * as React from 'react';
import { SingularProperty } from '../../api';

export function SingularPropertyComponent(props: {
  property: SingularProperty;
  data: string;
  onTextChanged: ((_event: React.ChangeEvent<HTMLInputElement>) => void);
}) {
  return <input readOnly={false} onChange={props.onTextChanged}
    className={styles['property-value']
      + ' miro-input miro-input--small miro-input--primary'}
    type="text" value={props.data}
    disabled={true}>
  </input>;
}
