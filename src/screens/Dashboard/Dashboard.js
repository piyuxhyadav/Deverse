import React, { useEffect, useState } from "react";
import {
	Text,
	TextInput,
	TouchableOpacity,
	View,
	useWindowDimensions,
	ScrollView,
	Modal,
	SafeAreaView,
} from "react-native";

import { v4 } from "uuid";
import {
	getStorage,
	ref,
	uploadBytes,
	listAll,
	getDownloadURL,
} from "firebase/storage";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { Dimensions } from "react-native";

import styles from "./styles";
import { firebase } from "../../firebase/config";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Dashboard(props) {
	//Firebase

	const windowWidth = Dimensions.get("window").width;
	const windowHeight = Dimensions.get("window").height;

	function logout() {
		props.setUser(null);
		return firebase.auth().signOut();
	}

	const entityRef = firebase.firestore().collection("entities");
	useEffect(() => {
		entityRef
			.where("authorID", "==", props.userData.id)
			.orderBy("createdAt", "desc")
			.onSnapshot(
				(querySnapshot) => {
					const newComplaints = [];
					querySnapshot.forEach((doc) => {
						const complaint = doc.data();
						complaint.id = doc.id;
						newComplaints.push(complaint);
					});

					setComplaints(newComplaints);
				},
				(error) => {
					console.log(error);
				}
			);
	}, []);

	async function resolved(complaintID) {
		const resolvedRef = firebase
			.firestore()
			.collection("entities")
			.doc(complaintID);
		const res = await resolvedRef.update({ isResolved: true });
		notifyAdhav(complaintID);
	}
	const storage = getStorage();
	const imagesListRef = ref(storage, `${props.userData.id}/`);

	async function uploadLinktoFirebase(complaintID, link) {
		const resolvedRef = firebase
			.firestore()
			.collection("entities")
			.doc(complaintID);
		const res = await resolvedRef.update({ link: link });
		notifyAdhav(complaintID);
	}

	const uploadLink = (complaintID) => {
		listAll(imagesListRef).then((response) => {
			response.items.forEach((item) => {
				if (item.fullPath == `${props.userData.id}/${imageName}`) {
					getDownloadURL(item).then((url) => {
						uploadLinktoFirebase(complaintID, url);
					});
				}
			});
		});
	};
	const notifyAdhav = async (complaintID) => {
		//imageLink

		const complaintRef = firebase
			.firestore()
			.collection("entities")
			.doc(complaintID);
		const docSnap = await getDoc(complaintRef);

		if (docSnap.exists()) {
			const complaintData = docSnap.data();

			const axios = require("axios").default;
			const qs = require("qs");

			if (complaintData.isResolved == true) {
				await axios.post(
					"https://api.twilio.com/2010-04-01/Accounts/" +
						"xxx" +
						"/Messages.json",
					qs.stringify({
						Body: `The complaint below is now solved, and there's no issue now. \nName: ${complaintData.fullName}  \nRoll No:  ${complaintData.rollNo} \nRoom : ${complaintData.room} \nSubject:${complaintData.subject} \nDescription:${complaintData.description} `,
						From: "whatsapp:+xxx",
						To: "whatsapp:+xxx",
					}),
					{
						auth: {
							username: "xxx",
							password: "xxx",
						},
					}
				);
			} else {
				await axios.post(
					"https://api.twilio.com/2010-04-01/Accounts/" +
						"xxxx" +
						"/Messages.json",
					qs.stringify({
						Body: `Name: ${complaintData.fullName}  \nRoll No:  ${complaintData.rollNo} \nRoom : ${complaintData.room} \nSubject:${complaintData.subject} \nDescription:${complaintData.description} `,
						MediaUrl: `${complaintData.link}`,
						From: "whatsapp:+xxx",
						To: "whatsapp:+xxx",
					}),
					{
						auth: {
							username: "xxx",
							password: "xxx",
						},
					}
				);
			}
		} else {
			console.log("doc not found");
		}
	};

	const [imageUpload, setImageUpload] = useState(null);
	const [imageName, setImageName] = useState("");
	function uploadImage() {
		if (imageUpload == null) {
			return;
		}

		const storage = getStorage();
		const imageRef = ref(storage, `${props.userData.id}/${imageName}`);
		uploadBytes(imageRef, imageUpload).then(() => {
			alert("image uploaded");
		});
	}

	const addComplaint = async () => {
		if (subject && subject.length > 0) {
			if (imageUpload == null) {
				alert("Upload Image");
				return;
			}
			const complaintID = v4();
			const timestamp = firebase.firestore.FieldValue.serverTimestamp();
			const data = {
				fullName: props.userData.fullName,
				subject: subject,
				authorID: props.userData.id,
				description: description,
				createdAt: timestamp,
				time: new Date().toLocaleString(),
				isResolved: isResolved,
				imageName: imageName,
				room: room,
				rollNo: props.userData.rollNo,
			};

			const complaintRef = firebase
				.firestore()
				.collection("entities")
				.doc(`${complaintID}`);

			setDoc(complaintRef, data)
				.then(() => {
					setSubject("");
					setDescription("");
					setModalVisible(false);
					uploadLink(complaintID);
				})
				.catch((error) => {
					alert(error);
				});
		}
	};

	const FirstRoute = () => (
		<ScrollView
			style={{
				flex: 1,
				border: "1 black solid",
			}}
		>
			{complaints.map((singleComplaint) => {
				if (singleComplaint.isResolved == false) {
					return (
						<View style={styles.complaintBox} key={singleComplaint.id}>
							<View style={{ display: "flex", flexDirection: "column" }}>
								<Text style={styles.complaintTitle}>
									{singleComplaint.subject}
								</Text>
								<Text style={{ fontSize: 16 }}>
									{singleComplaint.description}
								</Text>
								<Text style={{ fontSize: 16 }}>
									{singleComplaint.time.split(",")[0]}
								</Text>
							</View>
							<TouchableOpacity
								onPress={() => {
									resolved(singleComplaint.id);
								}}
								style={{
									...styles.button,
									paddingLeft: 10,
									paddingRight: 10,
								}}
							>
								<Text style={styles.buttonTitle}>Done</Text>
							</TouchableOpacity>
						</View>
					);
				}
			})}
		</ScrollView>
	);

	const SecondRoute = () => (
		<ScrollView
			style={{
				flex: 1,
				border: "1 black solid",
			}}
		>
			{complaints.map((singleComplaint) => {
				if (singleComplaint.isResolved == true) {
					return (
						<View style={styles.complaintBox} key={singleComplaint.id}>
							<View style={{ display: "flex", flexDirection: "column" }}>
								<Text style={styles.complaintTitle}>
									{singleComplaint.subject}
								</Text>
								<Text style={{ fontSize: "16 " }}>
									{singleComplaint.description}
								</Text>
								<Text style={{ fontSize: "16 " }}>
									{singleComplaint.time.split(",")[0]}
								</Text>
							</View>
						</View>
					);
				}
			})}
		</ScrollView>
	);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
	});

	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const [routes] = React.useState([
		{ key: "first", title: "Pending" },
		{ key: "second", title: "Completed" },
	]);

	const [modalVisible, setModalVisible] = useState(false);
	const [subject, setSubject] = useState("");
	const [room, setRoom] = useState("");
	const [description, setDescription] = useState("");
	const [complaints, setComplaints] = useState([]);
	const [isResolved, setIsResolved] = useState(false);

	return (
		<View style={styles.container}>
			<View style={styles.navbar}>
				<Text style={styles.title}>
					Welcome, {props.userData.fullName.split(" ")[0]}
				</Text>
				<TouchableOpacity
					onPress={logout}
					style={{
						backgroundColor: "#121330",
						padding: 10,
						height: "fit-content",

						borderRadius: 5,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text style={{ color: "white" }}>Log Out</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.mainBox}>
				<Text style={styles.complaintTitle}>Have any Complaint to file?</Text>
				<TouchableOpacity
					style={styles.button}
					onPress={() => setModalVisible(true)}
				>
					<Text style={styles.buttonTitle}> File Complaint</Text>
				</TouchableOpacity>
			</View>

			<View style={{ width: windowWidth, height: 650, marginTop: 10 }}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Text style={styles.title}> My Complaints</Text>
				</View>

				<TabView
					renderTabBar={(props) => (
						<TabBar {...props} style={{ backgroundColor: "rgb(18, 19, 48)" }} />
					)}
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={{ width: layout.width }}
				/>
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.modal}>
					<KeyboardAwareScrollView
						style={{ flex: 1, width: "100%", marginTop: 30 }}
						keyboardShouldPersistTaps="always"
					>
						<Text style={{ ...styles.buttonTitle, fontSize: 20 }}>
							Register Your Complaint
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Subject"
							placeholderTextColor="#aaaaaa"
							onChangeText={(text) => setSubject(text)}
							value={subject}
							underlineColorAndroid="transparent"
							autoCapitalize="none"
						/>
						{/* <Dropdown label="Select Category" data={categories} /> */}
						<TextInput
							style={styles.input}
							placeholder="Room"
							placeholderTextColor="#aaaaaa"
							onChangeText={(text) => setRoom(text)}
							value={room}
							underlineColorAndroid="transparent"
							autoCapitalize="none"
						/>
						<TextInput
							style={{ ...styles.input, height: 200 }}
							placeholder="Description"
							placeholderTextColor="#aaaaaa"
							onChangeText={(text) => setDescription(text)}
							value={description}
							underlineColorAndroid="transparent"
							autoCapitalize="none"
						/>

						<View style={{ ...styles.button, backgroundColor: "white" }}>
							<input
								type="file"
								onChange={(event) => {
									setImageName(v4());
									setImageUpload(event.target.files[0]);
								}}
							/>
						</View>

						<TouchableOpacity
							style={{ ...styles.button, backgroundColor: "white" }}
							onPress={uploadImage}
						>
							<Text style={{ ...styles.buttonTitle, color: "#121330" }}>
								Upload
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.button, backgroundColor: "white" }}
							onPress={addComplaint}
						>
							<Text style={{ ...styles.buttonTitle, color: "#121330" }}>
								Done
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.button, backgroundColor: "white" }}
							onPress={() => {
								setModalVisible(false);
							}}
						>
							<Text style={{ ...styles.buttonTitle, color: "#121330" }}>
								Discard
							</Text>
						</TouchableOpacity>
					</KeyboardAwareScrollView>
				</View>
			</Modal>
		</View>
	);
}
