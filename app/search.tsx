import React from 'react';
import { Redirect } from 'expo-router';

// Redirect to the tab search screen
export default function SearchRedirect() {
  return <Redirect href="/(tabs)/search" />;
}
