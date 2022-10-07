import React, { useEffect, useState, useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Reply,
  User,
} from 'react-native-gifted-chat';

// import * as contacts from '../relationships';
import * as models from '../models';
import { DUMMY_MESSAGE } from '../models/dummyData';
// import { showQR } from '../qrcode';
// import {
//   asContactShareable,
//   getContactByAlias,
//   getContactByDid,
//   showRel,
// } from '../relationships';
// import * as roots from '../roots';
import Loading from '../components/Loading';
import { styles } from '../styles/styles';
import { CompositeScreenProps } from '@react-navigation/core/src/types';
import { BubbleProps } from 'react-native-gifted-chat/lib/Bubble';

export default function ChatScreen({
  route,
  navigation,
}: CompositeScreenProps<any, any>) {
  console.log('ChatScreen - route params', route.params);
  const user = route.params.user;
  const [chat, setChat] = useState<models.chat>();
  // roots.getChatItem(route.params.chatId)
  const [contact, setContact] = useState<models.contact>();
  console.log('ChatScreen - got chatItem ', chat);
  const [loading, setLoading] = useState<boolean>(true);
  const [messages, setMessages] = useState<IMessage[]>(DUMMY_MESSAGE);
  const [processing, setProcessing] = useState<boolean>(false);

  //   useEffect(() => {
  //     console.log('ChatScreen - chat set', chat);
  //     const chatSession = roots.startChatSession(chat.id, {
  //       chat: chat,
  //       onReceivedMessage: (message) => {
  //         if (message && GiftedChat) {
  //           setMessages((currentMessages) => {
  //             const iMsg = mapMessage(message);
  //             if (iMsg) {
  //               return GiftedChat.append(currentMessages, [iMsg]);
  //             }
  //           });
  //         }
  //       },
  //       onProcessing: (processing) => {
  //         setProcessing(processing);
  //         console.log('ChatScreen - updated processing indicator', processing);
  //       },
  //     });
  //     if (chatSession.succeeded) {
  //       console.log('ChatScreen - chat session started successfully');
  //     } else {
  //       console.error('ChatScreen - chat session failed', chatSession.error);
  //     }

  //     setContact(getContactByAlias(chat.id));
  //     console.log('ChatScreen - getting all messages');
  //     const msgs = roots.getMessagesByChat(chat.id);
  //     console.log('ChatScreen - got', msgs.length, 'msgs');
  //     const mapMsgs = msgs.map((msg) => {
  //       return mapMessage(msg);
  //     });
  //     setMessages(mapMsgs);
  //     setLoading(false);
  //     return () => {
  //       chatSession.end;
  //     };
  //   }, [chat]);

  //   useEffect(() => {}, [messages]);

  //   async function handleSend(pendingMsgs: IMessage[]) {
  //     console.log('ChatScreen - handle send', pendingMsgs);
  //     const result = await roots.sendMessages(
  //       chat,
  //       pendingMsgs.map((msg) => msg.text),
  //       roots.MessageType.TEXT,
  //       contacts.getUserId()
  //     );
  //   }

  //   async function handleQuickReply(replies: Reply[]) {
  //     console.log(
  //       'ChatScreen - Processing Quick Reply w/ chat',
  //       chat.id,
  //       'w/ replies',
  //       replies.length
  //     );
  //     roots.updateProcessIndicator(chat.id);
  //     if (replies) {
  //       for (const reply of replies) {
  //         console.log('ChatScreen - processing quick reply', chat.id, reply);
  //         if (reply.value.startsWith(roots.MessageType.PROMPT_PUBLISH)) {
  //           console.log('ChatScreen - process quick reply to publish DID');
  //           if (reply.value.endsWith(roots.PUBLISH_DID)) {
  //             console.log('ChatScreen - publishing DID w/alias', chat.fromAlias);
  //             const pubChat = await roots.processPublishResponse(chat);
  //             if (pubChat) {
  //               setChat(pubChat);
  //             }
  //           } else {
  //             console.log('ChatScreen - not publishing DID');
  //           }
  //         } else if (reply.value.startsWith(roots.MessageType.PROMPT_OWN_DID)) {
  //           console.log('ChatScreen - quick reply view did');
  //           const r = roots.getMessageById(reply.messageId)?.data;
  //           console.log('ChatScreen - View rel', r);
  //           showRel(navigation, asContactShareable(r));
  //         } else if (
  //           reply.value.startsWith(roots.MessageType.PROMPT_ACCEPT_CREDENTIAL)
  //         ) {
  //           console.log(
  //             'ChatScreen - process quick reply for accepting credential'
  //           );
  //           const res = await roots.processCredentialResponse(chat, reply);
  //           console.log('ChatScreen - credential accepted?', res);
  //         } else if (
  //           reply.value.startsWith(roots.MessageType.PROMPT_ISSUED_CREDENTIAL)
  //         ) {
  //           if (reply.value.endsWith(roots.CRED_REVOKE)) {
  //             console.log(
  //               'ChatScreen - process quick reply for revoking credential'
  //             );
  //             const res = await roots.processRevokeCredential(chat, reply);
  //             console.log('ChatScreen - credential revoked?', res);
  //           } else if (reply.value.endsWith(roots.CRED_VIEW)) {
  //             console.log('ChatScreen - quick reply view issued credential');
  //             const vCred = roots.processViewCredential(reply.messageId);
  //             if (vCred) {
  //               navigation.navigate('Credential Details', { cred: vCred });
  //             }
  //           }
  //         } else if (
  //           reply.value.startsWith(roots.MessageType.PROMPT_OWN_CREDENTIAL)
  //         ) {
  //           console.log('ChatScreen - process quick reply for owned credential');
  //           if (reply.value.endsWith(roots.CRED_VERIFY)) {
  //             console.log('ChatScreen - quick reply verify credential');
  //             const credHash = roots.getMessageById(reply.messageId)?.data;
  //             console.log(
  //               'ChatScreen - verifying credential with hash',
  //               credHash
  //             );
  //             await roots.processVerifyCredential(chat, credHash);
  //           } else if (reply.value.endsWith(roots.CRED_VIEW)) {
  //             console.log('ChatScreen - quick reply view imported credential');
  //             const vCred = roots.processViewCredential(reply.messageId);
  //             if (vCred) {
  //               navigation.navigate('Credential Details', { cred: vCred });
  //             }
  //           }
  //         } else if (
  //           reply.value.startsWith(roots.MessageType.PROMPT_RETRY_PROCESS)
  //         ) {
  //           console.log('ChatScreen - process quick reply for retry process');
  //           const process = roots.getMessageById(reply.messageId)?.data;
  //           process();
  //         } else {
  //           console.log(
  //             'ChatScreen - reply value not recognized, was',
  //             chat.id,
  //             reply.value
  //           );
  //         }
  //       }
  //     } else {
  //       console.log(
  //         'ChatScreen - reply',
  //         replies,
  //         'or chat',
  //         chat,
  //         'were undefined'
  //       );
  //     }
  //   }

  //   function processBubbleClick(context: any, message: IMessage): void {
  //     console.log('ChatScreen - bubble pressed', context, message);
  //     const msg = roots.getMessageById(message._id.toString());
  //     if (msg) {
  //       switch (msg.type) {
  //         case roots.MessageType.BLOCKCHAIN_URL:
  //           console.log('ChatScreen - Clicked blockchain url msg', msg.data);
  //           Linking.openURL(msg.data);
  //           break;
  //         case roots.MessageType.DID:
  //           console.log('ChatScreen - Clickable did msg', msg.data);
  //           const c = getContactByDid(msg.data);
  //           if (c) {
  //             showQR(navigation, asContactShareable(c));
  //           }
  //           break;
  //         default:
  //           console.log('ChatScreen - Clicked non-active message type', msg.type);
  //       }
  //     }
  //   }

  //#fad58b
    function renderBubble(props: BubbleProps<IMessage>) {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#251520',
            },
          }}
          textStyle={{
            left: {
              color: '#fff',
            },
            right: {
              color: '#000',
            },
          }}
        />
      );
    }

    function renderInputToolbar(props: InputToolbarProps<IMessage>) {
      return (
        <InputToolbar
          {...props}
          containerStyle={{
            backgroundColor: '#604050',
            borderTopColor: '#dddddd',
            borderTopWidth: 1,
            padding: 1,
          }}
        />
      );
    }

  //   if (loading) {
  //     console.log('ChatScreen - Loading....');
  //     return <Loading />;
  //   }

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <View style={{ backgroundColor: '#251520', flex: 1, display: 'flex' }}>
      <GiftedChat
        isTyping={processing}
        inverted={false}
        messages={messages?.sort((a, b) => {
          return a.createdAt < b.createdAt ? -1 : 1;
        }).map(msg => ({...msg, text: `${msg.text}${user.displayName}`}))}
        placeholder={'Make a note...'}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 5,
        }}
        parsePatterns={(linkStyle) => [
          {
            type: 'url',
            style: styles.clickableListTitle,
            onPress: (tag: string) => Linking.openURL(tag),
          },
          {
            pattern: /\*Click to geek out on Cardano blockchain details\*/,
            style: styles.red,
          },
        ]}
        renderAvatarOnTop={true}
        renderInputToolbar={(props) => renderInputToolbar(props)}
        renderBubble={renderBubble}
        renderQuickReplySend={() => (
          <Text style={{ color: '#e69138', fontSize: 18 }}>Confirm</Text>
        )}
        renderUsernameOnMessage={true}
        showAvatarForEveryMessage={true}
      />
    </View>
  );

  //   function mapMessage(message: models.message): IMessage {
  //     console.log('ChatScreen - Map message for gifted', message);
  //     const image = message.image;
  //     const user = getContactByAlias(message.rel);
  //     const mappedMsg: IMessage = {
  //       _id: message.id,
  //       createdAt: message.createdTime,
  //       system: message.system,
  //       text: message.body,
  //       user: mapUser(user),
  //     };
  //     if (message.image) {
  //       mappedMsg.image = message.image;
  //     }
  //     if (message.quickReplies) {
  //       mappedMsg.quickReplies = message.quickReplies;
  //     }
  //     console.log('ChatScreen - got mapped message', mappedMsg);
  //     return mappedMsg;
  //     //image: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png',
  //     // You can also add a video prop:
  //     //video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  //     // Mark the message as sent, using one tick
  //     //sent: true,
  //     // Mark the message as received, using two tick
  //     //received: true,
  //     // Mark the message as pending with a clock loader
  //     //pending: true,
  //     // Any additional custom parameters are passed through
  //   }

  //   function mapUser(rel: models.contact | undefined): User {
  //     console.log('ChatScreen - Map User for gifted', rel);
  //     let user: User;
  //     if (rel) {
  //       user = {
  //         _id: rel.id,
  //         name: rel.displayName,
  //         avatar: rel.displayPictureUrl,
  //       };
  //     } else {
  //       console.error('Unable to map user', rel);
  //       user = {
  //         _id: '',
  //         name: '',
  //         avatar: '',
  //       };
  //     }

  //     console.log('ChatScreen - mapped user is', user);
  //     return user;
  //   }
}
