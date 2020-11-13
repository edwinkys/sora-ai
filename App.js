/*

Chatbot React Native App

*/
/* eslint-disable react-native/no-inline-styles */

// Import dependencies
import React, {Component} from 'react';

import {StyleSheet, View} from 'react-native';

import {
  GiftedChat,
  InputToolbar,
  Composer,
  Bubble,
  Send,
} from 'react-native-gifted-chat';

import {IconButton} from 'react-native-paper';

import {Dialogflow_V2} from 'react-native-dialogflow';

import {DialogflowConfig} from './env';

// Customize composer UI
const customtInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: '#f2faff',
        borderTopColor: '#b3e2ff',
      }}
    />
  );
};

const customComposer = (props) => {
  return (
    <Composer
      {...props}
      textInputStyle={{
        color: '#333',
        letterSpacing: 1,
        lineHeight: 25,
      }}
    />
  );
};

// Customize chat bubble
const customBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: '#0e354d',
          padding: 10,
          marginBottom: 20,
        },
        left: {
          backgroundColor: '#b3e3ff',
          padding: 10,
          marginBottom: 20,
          borderRadius: 10,
        },
      }}
      textStyle={{
        right: {
          color: '#f2faff',
          letterSpacing: 1,
          lineHeight: 25,
        },
        left: {
          color: '#0e354d',
          letterSpacing: 1,
          lineHeight: 25,
        },
      }}
    />
  );
};

// Customize send button
const customButton = (props) => {
  return (
    <Send {...props}>
      <View style={styles.justifyContentCenter}>
        <IconButton icon="send-circle" size={32} color="#0e354d" />
      </View>
    </Send>
  );
};

// Bot
const SORA = {
  _id: 2,
  name: 'Sora',
  avatar: 'https://i.ibb.co/1zChJn8/sky.png',
};

// App
class App extends Component {
  // Initial message
  state = {
    messages: [
      {
        _id: 1,
        text:
          'Hi mortal! My name is Sora, the Goddess of Sky.\n\nI will guide you in your adventure in this world. Be happy, hmph!',
        createdAt: new Date(),
        user: SORA,
      },
    ],
  };

  // Dialogflow configuration
  componentDidMount() {
    Dialogflow_V2.setConfiguration(
      DialogflowConfig.client_email,
      DialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      DialogflowConfig.project_id,
    );
  }

  // On event send message
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      (result) => this.handleGoogleResponse(result),
      (error) => console.log(error),
    );
  }

  // Dialogflow response
  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text);
  }

  // Send the response by the AI
  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: SORA,
    };

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, [msg]),
    }));
  }

  render() {
    return (
      <View
        style={[
          styles.flex,
          styles.container,
          styles.bgWhite,
          styles.defaultText,
        ]}>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          renderInputToolbar={(props) => customtInputToolbar(props)}
          renderBubble={(props) => customBubble(props)}
          renderSend={(props) => customButton(props)}
          renderComposer={(props) => customComposer(props)}
          bottomOffset={20}
          placeholder="Say something to Sora..."
          user={{
            _id: 1,
          }}
          alignTop
        />
      </View>
    );
  }
}

// Stylesheet
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    color: '#333',
  },

  defaultText: {
    letterSpacing: 1,
    lineHeight: 25,
  },

  bgWhite: {
    backgroundColor: '#f2faff',
  },

  itemsCenter: {
    alignItems: 'center',
  },

  justifyContentCenter: {
    justifyContent: 'center',
  },
});

export default App;
