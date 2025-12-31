import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { GameProvider } from "@/context/GameContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Game } from "@/pages/Game";
import { Home } from "@/pages/Home";
import { Settings } from "@/pages/Settings";
import { Stats } from "@/pages/Stats";
import { Summary } from "@/pages/Summary";

const RouteTransition = ({ children }: { children: React.ReactNode }) => (
	<motion.div
		className="w-full h-full"
		initial={{ opacity: 0, y: 10 }}
		animate={{ opacity: 1, y: 0 }}
		exit={{ opacity: 0, y: -10 }}
		transition={{ duration: 0.3, ease: "easeOut" }}
	>
		{children}
	</motion.div>
);

function App() {
	const location = useLocation();

	return (
		<SettingsProvider>
			{" "}
			{/* Wrapped GameProvider with SettingsProvider */}
			<GameProvider>
				<Layout>
					<AnimatePresence mode="wait">
						<Routes location={location} key={location.pathname}>
							<Route path="/" element={<Home />} />
							<Route
								path="/game"
								element={
									<RouteTransition>
										<Game />
									</RouteTransition>
								}
							/>
							<Route path="/summary" element={<Summary />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/stats" element={<Stats />} />
						</Routes>
					</AnimatePresence>
				</Layout>
			</GameProvider>
		</SettingsProvider>
	);
}

export default App;
