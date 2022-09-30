import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "white",
	},
	navbar: {
		borderBottomColor: "#121330",
		paddingBottom: 20,
		borderBottomWidth: 2,
		alignItems: "center",
		marginTop: 50,
		width: windowWidth,
		height: windowWidth * 0.1,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},
	title: {
		padding: 10,
		width: windowWidth,
		color: "#121330",
		fontSize: 26,
		fontWeight: "bold",
		textAlign: "left",
	},
	mainBox: {
		marginTop: 20,
		height: "fit-content",
		padding: 10,
		backgroundColor: "white",
		border: "1 pt solid black",
		borderRadius: 4,
		marginLeft: 10,
		marginRight: 10,
		width: windowWidth * 0.95,
	},
	button: {
		backgroundColor: "#121330",
		marginLeft: 30,
		marginRight: 30,
		marginTop: 10,
		marginBottom: 10,
		height: 48,
		borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonTitle: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	complaintBox: {
		marginTop: 10,
		height: 90,
		width: windowWidth,
		borderBottomColor: "black",
		borderBottomWidth: 1,
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
	},
	complaintTitle: {
		fontSize: 26,
		fontWeight: "bold",
	},
	modal: {
		height: "fit-content",
		width: windowWidth * 0.95,
		backgroundColor: "#121330",
		margin: "auto",
		borderRadius: 8,
		border: "1 solid white",
		paddingTop: 40,
		paddingBottom: 40,
	},

	input: {
		height: 48,
		borderRadius: 5,
		overflow: "hidden",
		backgroundColor: "white",
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 30,
		marginRight: 30,
		paddingLeft: 16,
	},
});
