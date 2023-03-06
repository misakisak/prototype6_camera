import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { FaceLandmarksDetector, faceLandmarksDetection } from '@tensorflow-models/face-landmarks-detection';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      // const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

    })();
  }, []);

  const takePicture = async() => {
      if(camera) {
          const data = await camera.takePictureAsync(null);
        //   console.log(data.uri)
        setImage(data.uri);
      }
  }

  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   mediaTypes: ImagePicker.MediaTypeOptions.All, <- if it was all it allow any type of image, video...
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
      });
      console.log(result);

      if (!result.cancelled) {
          setImage(result.uri);
      }
  }; 


  const FaceCheck = async () => {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs'
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
    }

    const detector =  faceLandmarksDetection.createDetector(model, detectorConfig);
    // const faces =  detector.estimateFaces(image);
    const faces = detector.estimateFaces(image);
    console.log(faces);
  }; 

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
        <View style={styles.cameraContainer}>
            <Camera
                ref={ref => setCamera(ref)} 
                style={styles.fixedRatio}
                type={type}
                ratio={'1:1'}
            />
        </View>

        <Button
            title="Flip Image"
            onPress={() => {
                setType(
                    type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constrants.Type.back
                );
            }}>
        </Button>

        <Button title="Take Picture" onPress={() => takePicture()}/>
        <Button title="Pick Image From Gallery" onPress={() => pickImage()}/>
        {/* <Button title="Save" onPress={() => navigation.navigate('Save', { image })}/> */}
        {image && <Image source={{uri: image}} style={{flex: 1, flexDirection: 'row'}}/>}
        
        {/* <Text style={{flex: 1, flexDirection: 'row'}}>{faces}</Text> */}
        <Button title="Face check" onPress={() => FaceCheck()} style={{flex: 1, flexDirection: 'row'}}/>
    </View>
  );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'

    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
})
