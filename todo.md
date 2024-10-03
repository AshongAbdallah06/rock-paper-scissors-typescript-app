<!-- This is a list of features I'm going to implement/fix  -->

Create users online feature

    /**
     	All todo:
    	Create an invite template that users can share in two player mode(maybe also in single player)
    	Create Invite a friend button
     * 	- Interactive Tutorials: Create a tutorial mode to help new players learn the game.
     * 	- Statistics Tracking: Provide detailed stats, such as win/loss ratio, most picked moves, streaks(wins, losses, ties), etc.
     * 	- todo: Remove chat popup when an empty space is clicked <------ Next todo:
     		- Create feature where players are allowed to play the game even when they are not logged in, and remind them that scores will not be saved
    			- Will be lost when page is refreshed
    			- Cant view profile, leaderboard
    			- Cant play bonus or dual mode



    			fixme: when in home(dual): players should not be able to change game type until they leave
    			type socket function parameters
     */



     <!-- Unused Functions -->

    const [isServerOk, setIsServerOk] = useState<boolean>(true);
    const startServer = async () => {
    	try {
    		const res = await Axios.get(
    			`https://rock-paper-scissors-app-iybf.onrender.com/api/user/${user?.username}`,
    			// `http://localhost:4001/api/user/${user?.username}`,
    			{
    				headers: { Authorization: `Bearer ${user.token}` },
    			}
    		);

    		if (res.data) setIsServerOk(true);
    	} catch (error) {
    		setIsServerOk(false);
    		console.log(error);
    		alert("Error Occurred. Check the console to see what occurred.");
    	}
    };
