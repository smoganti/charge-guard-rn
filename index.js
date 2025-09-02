import { AppRegistry } from 'react-native';
import App from './App';
import ChargeCardPopup from './src/components/ChargeCardPopup'; // Correct path to your popup component
import { name as appName } from './app.json';

// Register the main application
AppRegistry.registerComponent(appName, () => App);

// Register the separate popup component
AppRegistry.registerComponent('ChargeCardPopup', () => ChargeCardPopup);