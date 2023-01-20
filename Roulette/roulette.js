`use strict`;

/**
 * @typedef GameStatus
 * @type {Object}
 * @property {number} status 状态码
 * @property {string} msg 状态信息
 * @property {number | undefined} breech_left 剩余未开枪的枪膛数
 * @property {number | undefined} bullet_left 剩余子弹数
 */

let game_data = {};

/**
 * 在指定群聊中开始一局轮盘赌
 * @param {string | number} group_id 群号或其他能够唯一确定群聊的标识符
 * @param {number} breech 左轮手枪的总膛数
 * @param {number} bullets 枪膛中的子弹个数
 * @returns {GameStatus} 执行状态
 */
function start(group_id, breech, bullets) {
	if (typeof breech != 'number' || typeof bullets != 'number' || breech * bullets == 0)
		return {
			status: -2,
			msg: '参数错误',
		};
	if (game_data?.[group_id]?.breech == undefined || game_data?.[group_id]?.breech == 0) {
		game_data[group_id] = {};
		game_data[group_id].breech = breech;
		game_data[group_id].bullets = bullets;
		return {
			status: 0,
			bullet_left: game_data[group_id].bullets,
			breech_left: game_data[group_id].breech,
			msg: `游戏开始，剩余 ${game_data[group_id].bullets} 枚，分布在 ${game_data[group_id].breech} 个后膛中`,
		};
	} else
		return {
			status: -1,
			msg: '本群轮盘赌尚未结束',
		};
}

/**
 * 在指定群聊的轮盘赌中开枪
 * @param {number | string} group_id 群号或其他能够唯一确定群聊的标识符
 * @returns {GameStatus} 执行状态
 */
function shoot(group_id) {
	if (game_data?.[group_id]?.breech == undefined || game_data?.[group_id]?.breech == 0)
		return {
			status: -1,
			msg: '本群轮盘赌尚未开始',
		};

	let index = Math.floor(Math.random() * game_data[group_id].breech);
	if (index < game_data[group_id].bullets) {
		game_data[group_id].bullets--;
		game_data[group_id].breech--;

		if (game_data[group_id].bullets > 0) {
			return {
				status: 1,
				bullet_left: game_data[group_id].bullets,
				breech_left: game_data[group_id].breech,
				msg: `射出一枚子弹，剩余 ${game_data[group_id].bullets} 枚，分布在 ${game_data[group_id].breech} 个后膛中`,
			};
		} else {
			delete game_data.group_id;
			return {
				status: 0,
				bullet_left: game_data[group_id].bullets,
				breech_left: game_data[group_id].breech,
				msg: `射出一枚子弹，剩余 0 枚，游戏结束`,
			};
		}
	} else {
		game_data[group_id].breech--;
		return {
			status: 2,
			bullet_left: game_data[group_id].bullets,
			breech_left: game_data[group_id].breech,
			msg: `没有射出子弹，剩余 ${game_data[group_id].bullets} 枚，分布在 ${game_data[group_id].breech} 个后膛中`,
		};
	}
}

module.exports = {
	start,
	shoot,
};

