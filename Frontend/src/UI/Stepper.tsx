export default function Stepper() {
  return (
    <div className="w-full text-center">
      <ol className="steps">
        <li className="step step-primary step-done overflow-hidden">
          <div className="step-circle">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.49987 13.475L4.6082 10.5833C4.2832 10.2583 3.7582 10.2583 3.4332 10.5833C3.1082 10.9083 3.1082 11.4333 3.4332 11.7583L6.91654 15.2416C7.24154 15.5666 7.76654 15.5666 8.09154 15.2416L16.9082 6.42498C17.2332 6.09998 17.2332 5.57498 16.9082 5.24998C16.5832 4.92498 16.0582 4.92498 15.7332 5.24998L7.49987 13.475Z"
                className="fill-primary"
              />
            </svg>
          </div>
          <h3>Done</h3>
        </li>
        <li className="step step-primary step-done overflow-hidden">
          <div className="step-circle">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.49987 13.475L4.6082 10.5833C4.2832 10.2583 3.7582 10.2583 3.4332 10.5833C3.1082 10.9083 3.1082 11.4333 3.4332 11.7583L6.91654 15.2416C7.24154 15.5666 7.76654 15.5666 8.09154 15.2416L16.9082 6.42498C17.2332 6.09998 17.2332 5.57498 16.9082 5.24998C16.5832 4.92498 16.0582 4.92498 15.7332 5.24998L7.49987 13.475Z"
                className="fill-primary"
              />
            </svg>
          </div>
          <h3>In progress</h3>
        </li>
        <li className="step step-primary step-done overflow-hidden">
          <div className="step-circle">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.49987 13.475L4.6082 10.5833C4.2832 10.2583 3.7582 10.2583 3.4332 10.5833C3.1082 10.9083 3.1082 11.4333 3.4332 11.7583L6.91654 15.2416C7.24154 15.5666 7.76654 15.5666 8.09154 15.2416L16.9082 6.42498C17.2332 6.09998 17.2332 5.57498 16.9082 5.24998C16.5832 4.92498 16.0582 4.92498 15.7332 5.24998L7.49987 13.475Z"
                className="fill-primary"
              />
            </svg>
          </div>
          <h3>Waiting</h3>
        </li>
        <li className="step step-primary step-done overflow-hidden">
          <div className="step-circle">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.49987 13.475L4.6082 10.5833C4.2832 10.2583 3.7582 10.2583 3.4332 10.5833C3.1082 10.9083 3.1082 11.4333 3.4332 11.7583L6.91654 15.2416C7.24154 15.5666 7.76654 15.5666 8.09154 15.2416L16.9082 6.42498C17.2332 6.09998 17.2332 5.57498 16.9082 5.24998C16.5832 4.92498 16.0582 4.92498 15.7332 5.24998L7.49987 13.475Z"
                className="fill-primary"
              />
            </svg>
          </div>
          <h3>Waiting</h3>
        </li>
      </ol>
    </div>
  );
}
