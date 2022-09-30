import React, { useEffect, useState } from "react";
import {
	FlatList,
	Keyboard,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import styles from "./styles";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from "../../firebase/config";
import Dashboard from "../Dashboard/Dashboard";

const Stack = createStackNavigator();

export default function HomeScreen(props) {
	const [entityText, setEntityText] = useState("");
	const [entities, setEntities] = useState([]);

	const entityRef = firebase.firestore().collection("entities");
	const userID = props.extraData.id;

	return (
		<>
			<Dashboard setUser={props.setUser} userData={props.extraData} />
		</>
	);
}
