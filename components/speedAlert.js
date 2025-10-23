import React from 'react';
import { View, Text, Modal, StyleSheet, Button } from 'react-native';

const SpeedAlert = ({ visible, locationName, type }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.alertTitle}>🚨 Walking Alert!</Text>
          <Text style={styles.locationName}>{locationName}</Text>
          <Text style={styles.alertType}>{type}</Text>
          <Text style={styles.speedText}>You're walking in a monitored area</Text>
          <View style={styles.buttonContainer}>
            <Button title="OK" onPress={() => {}} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center'
  },
  alertType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center'
  },
  speedText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default SpeedAlert;