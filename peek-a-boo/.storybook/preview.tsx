import type { Preview } from "@storybook/react";
import React, { useState } from 'react'

import {
  IonApp,
  IonNav,
  IonItem,
  IonImg,
  IonButton,
  IonButtons,
  IonBackButton,
  IonNavLink,
  IonCard,
  IonTitle,
  IonCardTitle,
  IonPage,
  IonContent,
  setupIonicReact
} from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import '../src/theme/variables.css';

/* Ionic framework configuration to enforce same look and feel across platforms */
setupIonicReact()

const IonWrapper = ({ children }) => {
  return (
    <IonApp>
      <IonPage style={{ margin: '20px' }}>
        <IonContent>{children}</IonContent>
      </IonPage>
    </IonApp>
  )
}

export const decorators = [
  (Story) => (
    <IonWrapper>
      <Story />
    </IonWrapper>
  ),
]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
