`use strict`;

let game_data = {};

function start(group_id, breech, bullets) {
	if (typeof breech != 'number' || typeof bullets != 'number')
		return {
			status: -2,
			msg: '参数类型错误',
		};
	if (game_data?.[group_id]?.breech == undefined || game_data?.[group_id]?.breech == 0) {
		game_data[group_id].breech = breech;
		game_data[group_id].bullets = bullets;
	} else
		return {
			status: -1,
			msg: '本群轮盘赌尚未结束',
		};
}

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

