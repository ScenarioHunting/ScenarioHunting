import * as React from 'react';
import * as ReactDOM from 'react-dom';
function Hello() {
    return (
        <button onClick={() => alert('Hello!')}>
            Click me!
        </button>
    );
}

ReactDOM.render(<Hello />, document.getElementById('react-app'));
// const Hello = <button onClick={() => alert('Hello!')}>
//     Click me!
// </button >
// ReactDOM.render(Hello, document.getElementById('react-app'));
