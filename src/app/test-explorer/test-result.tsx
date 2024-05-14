import * as React from 'react';
import { TestExecutionStatus } from './test-execution-viewmodel';
import { TestStatus } from './test-status';

// eslint-disable-next-line no-undef
export const TestResult = (props: TestExecutionStatus): JSX.Element => {

  return <span title={props.message} className="test-running-status">
    {props.status == TestStatus.NotRun.toString() ?
      <div className="test-not-run">
        {/* <FontAwesomeIcon icon={faRunning} /> */}
            Not Run
      </div>
      : props.status == TestStatus.Running.toString() ?
        <div className="test-running">
          {/* <FontAwesomeIcon icon={faRunning} /> */}
                    Running
        </div >
        : props.status == TestStatus.Passed.toString() ?
          <div className="test-passed">
            {/* <FontAwesomeIcon icon={faCheck} /> */}
                        Passed
            {/* <span className="tooltiptext">
                            Test is running please wait!
                        </span> */}

          </div >
          : props.status == TestStatus.Failed.toString() ?
            <div className="test-failed" >
              {/* <FontAwesomeIcon icon={faStop} /> */}
              {/* <span className="tooltiptext" >
                                {props.message}
                            </span> */}
                         Failed
            </div >
            : props.status == TestStatus.Skipped.toString() ?
              <div className="test-skipped">
                {/* <FontAwesomeIcon icon={faExclamation} /> */}
                        Skipped
              </div>
              :

              <div className="test-running-error">
                {/* <FontAwesomeIcon icon={faCut} /> */}
                        Error in running
                {/* <span className="tooltiptext">
                                    {props.message}
                                </span> */}
              </div>
    }
  </span>;
  //TODO: refactor it:
  // switch (props.Status) {
  //     case TestStatus.Passed:
  //         return <pre>Passed</pre>
  //     case TestStatus.Failed:
  //         return <pre>Failed</pre>
  //     case TestStatus.Skipped:
  //         return <pre>Skipped</pre>
  //     default:
  //         return <pre>Error</pre>
  // }
  // return <></>
};

