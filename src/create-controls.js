import _ from '../libs/lodash.js'
const changeDirection = (move, direction, step = 1) => {
    const directions = ['n', 'e', 's', 'w']
    // find the current direction on the list
    const baseIndex = _.indexOf(directions, direction)
    switch (move) {
        case 'r': // get the next direction on the list, wrap around if needed
            return directions[
                (baseIndex + step) % directions.length
            ]
        case 'l': // get the preceding direction on the list, wrap around if needed
            return directions[
                (baseIndex - step < 0 ? directions.length : baseIndex) - step
            ]
    }
}

const moveForward = (x, y, direction, step = 1) => {
    switch (direction) {
        case 'n': return { x, y: y - step } // go up on the y axis
        case 'e': return { x: x + step, y } // go right the x axis
        case 's': return { x, y: y + step } // go down on the y axis
        case 'w': return { x: x - step, y } // go left on the x axis
    }
}

const moveBackward = (x, y, direction, step = 1) => {
    switch (direction) {
        case 'n': return { x, y: y + step } // go down on the y axis
        case 'e': return { x: x - step, y } // go left on the x axis
        case 's': return { x, y: y - step } // go up on the y axis
        case 'w': return { x: x + step, y } // go right the x axis
    }
}

const move = (direction, robot) => {
    const { x, y, o } = robot
    switch (direction) {
        case 'f': return { ...robot, ...moveForward(x, y, o) }
        case 'b': return { ...robot, ...moveBackward(x, y, o) }
        case 'r':
        case 'l': return { ...robot, o: changeDirection(direction, o) }
    }
}

export default bounds => {
    const createReport = (rX, rY, o) => {
        if (isWalker(rX, rY)) {
            // get the coordinates of the last tile the robot was seen on
            const { x, y } = moveBackward(rX, rY, o)
            return `I died going ${_.toUpper(o)} from coordinates: ${x}, ${y}`
        }
        return `Position: ${rX}, ${rY} | Orientation: ${_.toUpper(o)}`
    }

    const isWalker = _.curry((r, b, x, y) => (
        x < 0 || // robot is off the grid to the west
        y < 0 || // robot is off the grid to the north
        x > r || // robot is off the grid to the east
        y > b    // robot is off the grid to the south
    ))(...bounds)

    const moveRobot = _.curry((bX, bY, direction, robot, walkers) => {
        // get the new position of the robot
        const { x, y, o } = move(direction, robot)
        // create a generic, forward looking robot
        const successor = { ...robot, x, y, o, command: _.tail(robot.command) }
        // will the intended location of the robot kill him?
        if (isWalker(x, y)) {
            // let's find out if a walker has departed from this location
            const warning = walkers.find(walker => {
                // get the coordinates of the last tile the walker was seen on
                const { x, y } = move('b', walker)
                // attempt to match the walker's last location with the robot's current
                if (robot.x === x && robot.y === y) return true
            })
            // attempt to stop robot with a potential warning
            if (warning) return { ...successor, x: robot.x, y: robot.y }
            // it appears the warning wasn't good enough, it's now a walker robot
            return { ...successor, command: [] }
        }
        // create the robot with a new position
        return { ...successor, x, y }
    })(...bounds)

    return { isWalker, moveRobot, createReport }
}
