import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { GameProvider } from "@/context/GameContext";
import { Game } from "@/pages/Game";
import { Home } from "@/pages/Home";
import { Summary } from "@/pages/Summary";

function App() {
	return (
		<GameProvider>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/game" element={<Game />} />
					<Route path="/summary" element={<Summary />} />
				</Routes>
			</Layout>
		</GameProvider>
	);
}

export default App;
