package rps

import(
	`time`
	`strconv`
	`testing`
	`github.com/0xor1/oak`
	`github.com/gorilla/mux`
	`github.com/stretchr/testify/assert`
)

const(
	_RCK = `rck`
	_PPR = `ppr`
	_SCR = `scr`
)

func Test_RouteLocal(t *testing.T){
	RouteLocalTest(mux.NewRouter(), []string{_RCK, _PPR, _SCR}, [][]int{[]int{1}, []int{-1, 1}}, 1000, ``, ``, ``, ``)
}

func Test_RouteGae(t *testing.T){
	RouteGaeProd(mux.NewRouter(), []string{_RCK, _PPR, _SCR}, [][]int{[]int{1}, []int{-1, 1}}, 1000, ``, ``, ``, ``, nil)
}

func Test_getJoinResp(t *testing.T){
	standardSetup()
	g := initGame(newGame()).(*game)

	json := getJoinResp(``, g)

	var zeroTime time.Time
	assert.Equal(t, options, json[`options`], `options should be equal to options`)
	assert.Equal(t, resultHalfMatrix, json[`resultHalfMatrix`], `resultHalfMatrix should be equal to resultHalfMatrix`)
	assert.Equal(t, 3000, json[`turnLength`], `turnLength should be 3000`)
	assert.Equal(t, g.getPlayerIdx(``), json[`myIdx`], `myIdx should be -1 when just observing`)
	assert.Equal(t, zeroTime, json[`turnStart`], `turnStart should be zero time`)
	assert.Equal(t, g.State, json[`state`], `state should be g.State`)
	assert.Equal(t, g.CurrentChoices, json[`currentChoices`], `currentChoices should be g.CurrentChoices`)
	assert.Equal(t, g.PastChoices, json[`pastChoices`], `pastChoices should be g.PastChoices`)
	assert.Equal(t, _REMATCH_TIME_LIMIT, json[`rematchTimeLimit`], `rematchTimeLimit should be _RESTART_TIME_LIMIT`)
	assert.Equal(t, _DOUBLE_MAX_TURNS / 2, json[`maxTurns`], `maxTurns should be _DOUBLE_MAX_TURNS / 2`)
	assert.Equal(t, len(g.PastChoices), json[`pastChoicesCount`], `pastChoicesCount should len(g.PastChoices)`)
	assert.Equal(t, 11, len(json), `json should contain 11 entries`)
}

func Test_getEntityChangeResp(t *testing.T){
	standardSetup()
	g := initGame(newGame()).(*game)
	g.PastChoices = []string{`rck`, `ppr`}

	json := getEntityChangeResp(``, g)

	var zeroTime time.Time
	assert.Equal(t, zeroTime, json[`turnStart`], `turnStart should be zero time`)
	assert.Equal(t, g.State, json[`state`], `state should be g.State`)
	assert.Equal(t, g.CurrentChoices, json[`currentChoices`], `currentChoices should be g.CurrentChoices`)
	assert.Equal(t, len(g.PastChoices), json[`pastChoicesCount`], `pastChoicesCount should len(g.PastChoices)`)
	assert.Equal(t, []string{`rck`, `ppr`}, json[`penultimateChoices`], `penultimateChoices should be 'rck', 'ppr'`)
	assert.Equal(t, 5, len(json), `json should contain 5 entries`)
}

func Test_getEntityChangeResp_when_one_user_has_entered_a_choice_and_tother_hasnt(t *testing.T){
	standardSetup()
	g := initGame(newGame()).(*game)
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`1`, `2`}
	g.CurrentChoices = []string{`rck`, ``}

	json := getEntityChangeResp(`1`, g)

	assert.Equal(t, []string{`rck`, ``}, json[`currentChoices`], `currentChoices should be visible`)

	json = getEntityChangeResp(`2`, g)

	assert.Equal(t, []string{``, ``}, json[`currentChoices`], `currentChoices should not be visible`)
}

func Test_performAct_without_act_param(t *testing.T){
	standardSetup()
	json := oak.Json{}
	g := initGame(newGame())

	err := performAct(json, ``, g)

	assert.Equal(t, _ACT + ` value must be included in request`, err.Error(), `error should include appropriate message`)
}

func Test_performAct_with_non_string_act_param(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:true}
	g := initGame(newGame())

	err := performAct(json, ``, g)

	assert.Equal(t,_ACT + ` must be a string value`, err.Error(), `error should include appropriate message`)
}

func Test_performAct_with_invalid_act_param(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:`fail`}
	g := initGame(newGame())

	err := performAct(json, ``, g)

	assert.Equal(t, _ACT + ` must be either ` + _RESTART + ` or ` + _CHOOSE, err.Error(), `error should include appropriate message`)
}

func Test_performAct_restart_when_inappropriate_time(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_RESTART}
	g := initGame(newGame())

	err := performAct(json, ``, g)

	assert.Equal(t, `game is not waiting for restart`, err.Error(), `error should include appropriate message`)
}

func Test_performAct_restart_with_invalid_user(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_RESTART}

	g := initGame(newGame()).(*game)
	dur, _ := time.ParseDuration(`-` + strconv.Itoa(turnLength + 1000) + _TIME_UNIT)
	g.TurnStart = now().Add(dur)
	g.State = _WAITING_FOR_REMATCH

	err := performAct(json, ``, g)

	assert.Equal(t, `user is not a player in this game`, err.Error(), `error should include appropriate message`)
}

func Test_performAct_restart_success(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_RESTART}

	g := initGame(newGame()).(*game)
	dur, _ := time.ParseDuration(`-` + strconv.Itoa(turnLength + 1000) + _TIME_UNIT)
	g.TurnStart = now().Add(dur)
	g.State = _WAITING_FOR_REMATCH
	g.PlayerIds = []string{`0`, `1`}
	g.CurrentChoices = []string{`0`, `1`}

	err := performAct(json, `0`, g)

	assert.Nil(t, err, `err should be nil`)
	assert.Equal(t, ``, g.CurrentChoices[0], `CurrentChoices[0] should be set to empty string`)
	assert.Equal(t, _WAITING_FOR_REMATCH, g.State, `State should still be _WAITING_FOR_RESTART`)

	err = performAct(json, `0`, g)

	assert.Equal(t, `player has already opted to restart`, err.Error(), `err should contain appropriate message`)

	err = performAct(json, `1`, g)

	assert.Nil(t, err, `err should be nil`)
	assert.Equal(t, ``, g.CurrentChoices[1], `CurrentChoices[1] should be set to empty string`)
	assert.Equal(t, _GAME_IN_PROGRESS, g.State, `State should be set to _GAME_IN_PROGRESS`)
	dur, _ = time.ParseDuration(strconv.Itoa(_START_TIME_BUF) + _TIME_UNIT)
	assert.Equal(t, now().Add(dur), g.TurnStart, `TurnStart should have been updated`)
	dur, _ = time.ParseDuration(_DELETE_AFTER)
}

func Test_performAct_choose_without_val_param(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE}

	g := initGame(newGame()).(*game)
	g.TurnStart = now()
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`0`, `1`}

	err := performAct(json, `0`, g)

	assert.Equal(t, _VAL + ` value must be included in request`, err.Error(), `err should have appropriate message`)
}

func Test_performAct_choose_with_non_string_val_param(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE, _VAL:true}

	g := initGame(newGame()).(*game)
	g.TurnStart = now()
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`0`, `1`}

	err := performAct(json, `0`, g)

	assert.Equal(t, _VAL + ` must be a string value`, err.Error(), `err should have appropriate message`)
}

func Test_performAct_choose_when_game_not_in_progress(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE, _VAL:`wrong_val`}

	g := initGame(newGame()).(*game)
	g.TurnStart = now()
	g.State = _WAITING_FOR_OPPONENT

	err := performAct(json, `0`, g)

	assert.Equal(t,`game is not in progress`, err.Error(), `err should have appropriate message`)
}

func Test_performAct_choose_with_invalid_player_id(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE, _VAL:`wrong_val`}
	dur, _ := time.ParseDuration(`-1s`)

	g := initGame(newGame()).(*game)
	g.TurnStart = now().Add(dur)
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`0`, `1`}

	err := performAct(json, `not_a_valid_player_id`, g)

	assert.Equal(t, `user is not a player in this game`, err.Error(), `err should have appropriate message`)
}

func Test_performAct_choose_with_invalid_choice(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE, _VAL:`wrong_val`}
	dur, _ := time.ParseDuration(`-1s`)

	g := initGame(newGame()).(*game)
	g.TurnStart = now().Add(dur)
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`0`, `1`}

	err := performAct(json, `0`, g)

	assert.Equal(t, `choice is not a valid string, must be one of: `+_RCK+`, `+_PPR+`, `+_SCR, err.Error(), `err should have appropriate message`)
}

func Test_performAct_choose_when_players_choice_has_already_been_made(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE, _VAL:_RCK}
	dur, _ := time.ParseDuration(`-1s`)

	g := initGame(newGame()).(*game)
	g.TurnStart = now().Add(dur)
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`0`, `1`}
	g.CurrentChoices = []string{`0`, `1`}

	err := performAct(json, `0`, g)

	assert.Equal(t, `user choice has already been made`, err.Error(), `err should have appropriate message`)
}

func Test_performAct_choose_when_turn_has_not_started(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE, _VAL:_RCK}
	dur, _ := time.ParseDuration(`1s`)

	g := initGame(newGame()).(*game)
	g.TurnStart = now().Add(dur)
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`0`, `1`}

	err := performAct(json, `0`, g)

	assert.Equal(t, `turn hasn't started yet`, err.Error(), `err should have appropriate message`)
}

func Test_performAct_choose_success(t *testing.T){
	standardSetup()
	json := oak.Json{_ACT:_CHOOSE, _VAL:_RCK}
	dur, _ := time.ParseDuration(`-1s`)

	g := initGame(newGame()).(*game)
	g.TurnStart = now().Add(dur)
	g.State = _GAME_IN_PROGRESS
	g.PlayerIds = []string{`0`, `1`}

	err := performAct(json, `0`, g)

	assert.Nil(t, err, `err should be nil`)
	assert.Equal(t, _RCK, g.CurrentChoices[0], `PlayerChoice[0] should have been set`)
	assert.Equal(t, ``, g.CurrentChoices[1], `PlayerChoice[1] should still be unset`)

	json[_VAL] = _PPR
	err = performAct(json, `1`, g)

	assert.Nil(t, err, `err should be nil`)
	assert.Equal(t, _RCK, g.CurrentChoices[0], `PlayerChoice[0] should still be same value`)
	assert.Equal(t, _PPR, g.CurrentChoices[1], `PlayerChoice[1] should have been set`)
}

func standardSetup(){
	RouteLocalTest(mux.NewRouter(), []string{_RCK, _PPR, _SCR}, [][]int{[]int{1}, []int{-1, 1}}, 1000, ``, ``, ``, ``)
}
