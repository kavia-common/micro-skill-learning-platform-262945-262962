import { render } from '@testing-library/react';
import App from './App';

test('app renders without crashing', () => {
  // Smoke test: ensure the App mounts
  render(<App />);
});
