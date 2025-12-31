import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { GameProvider } from "@/context/GameContext";
import { Game } from "@/pages/Game";
import { Home } from "@/pages/Home";
import { Summary } from "@/pages/Summary";

function App() {
	const location = useLocation();

	return (
		<GameProvider>
			<Layout>
				<AnimatePresence mode="wait">
					<Routes location={location} key={location.pathname}>
						<Route path="/" element={<Home />} />
						<Route path="/game" element={<Game />} />
						<Route path="/summary" element={<Summary />} />
					</Routes>
				</AnimatePresence>
			</Layout>
		</GameProvider>
	);
}

export default App;
