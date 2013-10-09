#\ -s puma -E production

require './app'
require './middlewares/websocket'

use Redch::Websocket

run Redch::App
