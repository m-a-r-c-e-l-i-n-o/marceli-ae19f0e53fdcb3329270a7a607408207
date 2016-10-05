import '../libs/engine.js'
import _ from '../libs/lodash.js'
import createControls from './create-controls'

// stub window for serverside check
if (!window) window = {}

window.initGame = () => {
    console.log('initgame')

    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and robos for subsequent steps
    const parseInput = (input) => {
        //
        // task #1
        //
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'w', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below

        const command = _(input).split('\n') // parse line by line
        const [
            unparsedBounds, // take the bounds string, which is the first line
         ...unparsedRobos // take the robo strings, which is all other lines
        ] = command

        // parse bounds -> [x,y]
        const bounds = _(unparsedBounds) .trim().split(' ').map(Number)

        // take the location and commands, which will occur in every two lines
        const robos = _(unparsedRobos).chunk(2).map(([ location, command ]) => {
            // take the x and y coordinates, along with the direction
            const [ x, y, direction ] = _(location).trim().split(' ')
            // return robo object according to engine spec
            return {
                x: Number(x),
                y: Number(y),
                o: _.toLower(direction),
                command: _.split(_.toLower(_.trim(command)), '')
            }
        })
        .value()

        // create controls with bounds data built-in
        window.rover.controls = createControls(bounds)

        // return data object according to engine spec
        return { bounds, robos }
    }

    // this function replaces the robos after they complete one instruction
    // from their commandset
    const tickRobos = (robos) => {
        //
        // task #2
        //
        // in this function, write business logic to move robos around the playfield
        // the 'robos' input is an array of objects; each object has 4 parameters.
        // This function needs to edit each robot in the array so that its x/y coordinates
        // and orientation parameters match the robot state after 1 command has been completed.
        // Also, you need to remove the command the robot just completed from the command list.
        // example input:
        //
        // robos[0] = {x: 2, y: 2, o: 'n', command: 'frlrlrl'}
        //
        //                   - becomes -
        //
        // robos[0] = {x: 2, y: 1, o: 'n', command: 'rlrlrl'}
        //
        // if a robot leaves the bounds of the playfield, it should be removed from the robos
        // array. It should leave a 'scent' in it's place. If another robot–for the duration
        // of its commandset–encounters this 'scent', it should refuse any commands that would
        // cause it to leave the playfield.

        const control = window.rover.controls

        // define valid actions
        const directionalCommands = ['f', 'r', 'l']

        // get robots that have departed from the grid
        const walkers = _(robos).concat([]).filter(({ x, y }) => (
            control.isWalker(x, y)
        )).value()

        const movedRobots = _.map(robos, robot => {
            const { x, y, o, command } = robot
            // get the action, which is the top item in the command stack
            const instruction = _.head(command)
            // if there is no action, the robot is dead or done moving
            // either way, leave it as is
            if (!instruction) return robot
            // check if the instruction is valid
            if (directionalCommands.includes(instruction)) {
                const movedRobot = control.moveRobot(instruction, robot, walkers)
                // if the move killed the robot
                if (control.isWalker(movedRobot.x, movedRobot.y)) {
                    // add it to the local walkers store so that any other robot
                    // in this same session will know of this walker
                    walkers.push(movedRobot)
                }
                return movedRobot
            }
            throw new Error(`Command ${instruction} is invalid.`)
        })

        return movedRobots
    }
    // mission summary function
    const missionSummary = (robos) => {
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md

        const control = window.rover.controls
        // let's create the elements and insert them all at once
        const alive = document.createDocumentFragment()
        const walker = document.createDocumentFragment()
        robos.forEach(({ x, y, o: direction }) => {
            const child = document.createElement('li')
            const parent = (control.isWalker(x, y) ? walker : alive)
            child.innerText = control.createReport(x, y, direction)
            parent.appendChild(child)
        })
        document.getElementById('robots').appendChild(alive)
        document.getElementById('lostRobots').appendChild(walker)
    }

    // leave this alone please
    window.rover = {
        controls: null,
        parse: parseInput,
        tick: tickRobos,
        summary: missionSummary,
        command: '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL'
    }
}
