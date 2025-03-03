import { Op, Sequelize } from "sequelize";

import Course from "../models/Course.js";
import CourseMember from "../models/CourseMember.js";
import CourseShift from "../models/CourseShift.js";
import AdditionalTeacherData from "../models/AdditionalTeacherData.js";
import Tag from "../models/Tag.js";
import { COURSE_TIME_STATUS, MEMBER_STATUS, ROLE, TAG_MODE, TAG_TYPE } from "../utils/const.js";
import User from "../models/User.js";

function createWhereClause(filter) {
	let where = {};
	if (filter) {
		if (filter.name) where.name = { [Op.like]: `%${filter.name}%` };
		where.start_date = {};
		if (filter.from_start_date) where.start_date = { ...where.start_date, [Op.gte]: filter.from_start_date };
		if (filter.to_start_date) where.start_date = { ...where.start_date, [Op.lte]: filter.to_start_date };
		if (Object.getOwnPropertySymbols(where.start_date).length == 0) delete where.start_date;
		where.end_date = {};
		if (filter.from_end_date) where.end_date = { ...where.end_date, [Op.gte]: filter.from_end_date };
		if (filter.to_end_date) where.end_date = { ...where.end_date, [Op.lte]: filter.to_end_date };
		if (Object.getOwnPropertySymbols(where.end_date).length == 0) delete where.end_date;
		where.fee = {};
		if (filter.from_fee) where.fee = { ...where.fee, [Op.gte]: filter.from_fee };
		if (filter.to_fee) where.fee = { ...where.fee, [Op.lte]: filter.to_fee };
		if (Object.getOwnPropertySymbols(where.fee).length == 0) delete where.fee;
		if (filter.is_approved !== undefined) where.is_approved = filter.is_approved;
		// if (filter.is_private !== undefined) where.is_private = filter.is_private;
		if (filter.is_private !== undefined) where.is_private = filter.is_private;
		if (filter.course_time_status !== undefined) {
			if (filter.course_time_status !== COURSE_TIME_STATUS.HAVE_NOT_STARTED) {
				where.start_date = {
					[Op.lte]: new Date()
				};
			}
			if (filter.course_time_status !== COURSE_TIME_STATUS.COMPLETED) {
				where.end_date = {
					[Op.gte]: new Date()
				};
			}
			if (filter.course_time_status !== COURSE_TIME_STATUS.IN_PROGRESS) {
				where.start_date = {
					[Op.lte]: new Date()
				};
				where.end_date = {
					[Op.gte]: new Date()
				};
			}
		}
		if (filter.code !== undefined) where.code = { [Op.like]: `%${filter.code}%` };
	}
	return where;
}

function createOrderClause(sort) {
	const order = [];
	if (sort) {
		for (const key in sort) order.push([key, sort[key]]);
	}
	return order;
}

function createIncludeClause({ filter, tag_mode }) {
	const include = [];
	let where;
	// WARNING: ARCANE STUFF!!!
	// Filter each tag_id in CourseTags table, then use INNER JOIN to filter courses.
	// It's not a good practice to use raw SQL in Sequelize, but it's a quick fix for now.
	// UPDATED 08/02/2025: ARCANE OVERLOAD!
	// The (course_id = \`Course\`.\`id\` AND) part is injected based on the raw query generated by Sequelize. This is very illegal.
	if (filter && filter.tag_ids && filter.tag_ids.length > 0) {
		where = {
			[tag_mode === TAG_MODE.OR ? Op.or : Op.and]: filter.tag_ids.map((tag_id) =>
				Sequelize.literal(
					`EXISTS (SELECT 1 FROM CourseTags WHERE course_id = \`Course\`.\`id\` AND tag_id = ${tag_id})`
				)
			)
		};
	}
	include.push({
		model: Tag,
		as: "tags",
		attributes: ["id", "name", "type", "code_fragment"],
		// INNER JOIN when have filter.tag_ids
		required: filter && filter.tag_ids && filter.tag_ids.length > 0,
		where: where,
		through: {
			attributes: []
		}
	});
	include.push({
		model: CourseShift,
		as: "shifts",
		attributes: ["id", "day", "shift", "room"]
	});
	include.push({
		model: User,
		as: "members",
		attributes: ["id", "name", "role", "avatar_url"],
		required: false,
		where: {
			role: ROLE.TEACHER
		},
		include: {
			model: AdditionalTeacherData,
			as: "additional_teacher_data",
			include: {
				model: Tag,
				as: "subject"
			}
		},
		through: {
			attributes: []
		}
	});
	return include;
}

const courseDto = {
	checkTags: async (tag_ids, transaction) => {
		const tags = await Tag.findAll({
			where: {
				id: {
					[Op.in]: tag_ids
				}
			},
			transaction
		});
		if (tags.length !== tag_ids.length) {
			return false;
		}
		const hasSubject = tags.some((tag) => tag.type === TAG_TYPE.SUBJECT);
		const hasGrade = tags.some((tag) => tag.type === TAG_TYPE.GRADE);
		if (!(hasSubject && hasGrade)) {
			return false;
		}
		return true;
	},

	find: async ({ limit, offset, filter, sort, tag_mode }, transaction) => {
		return Course.findAll({
			limit,
			offset,
			where: createWhereClause(filter),
			order: createOrderClause(sort),
			include: createIncludeClause({ filter, tag_mode }),
			transaction
		}).then((courses) =>
			courses.map((c) => {
				let o = c.toJSON();
				o["teacher"] =
					o.members.length === 0
						? null
						: {
								id: o.members[0].id,
								name: o.members[0].name,
								avatar_url: o.members[0].avatar_url,
								subject: o.members[0].additional_teacher_data.subject,
								portfolio: o.members[0].additional_teacher_data.portfolio
							};
				delete o["members"];
				return o;
			})
		);
	},

	total: async ({ filter, tag_mode }, transaction) => {
		return Course.count({
			where: createWhereClause(filter),
			include: createIncludeClause({ filter, tag_mode }),
			distinct: true,
			transaction
		});
	},

	findById: async (id, transaction) => {
		return Course.findByPk(id, { include: createIncludeClause({}), transaction }).then((c) => {
			let o = c.toJSON();
			o["teacher"] =
				o.members.length === 0
					? null
					: {
							id: o.members[0].id,
							name: o.members[0].name,
							avatar_url: o.members[0].avatar_url,
							subject: o.members[0].additional_teacher_data.subject,
							portfolio: o.members[0].additional_teacher_data.portfolio
						};
			delete o["members"];
			return o;
		});
	},

	findMyCourses: async (userId, { limit, offset, filter, sort, tag_mode }, transaction) => {
		const courseMember = await CourseMember.findAll({
			where: {
				user_id: userId,
				status: MEMBER_STATUS.APPROVED
			},
			transaction
		});
		console.log(courseMember, "TEST");
		const courseIds = courseMember.map((member) => member.course_id);
		console.log(courseIds, "TEST ID");
		const where = {
			...createWhereClause(filter),
			id: {
				[Op.in]: courseIds
			}
		};
		console.log(where, "TEST WHERE");
		const courses = await Course.findAll({
			where: {
				...createWhereClause(filter),
				id: {
					[Op.in]: courseIds
				}
			},
			include: createIncludeClause({ filter, tag_mode }),
			order: createOrderClause(sort),
			limit,
			offset,
			transaction
		});
		console.log(courses, "TEST COURSE");
		const total = await Course.count({
			where: {
				...createWhereClause(filter),
				id: {
					[Op.in]: courseIds
				}
			},
			include: createIncludeClause({ filter, tag_mode }),
			distinct: true,
			transaction
		});
		return {
			data: courses.map((c) => {
				let o = c.toJSON();
				o["teacher"] =
					o.members.length === 0
						? null
						: {
								id: o.members[0].id,
								name: o.members[0].name,
								avatar_url: o.members[0].avatar_url,
								subject: o.members[0].additional_teacher_data.subject,
								portfolio: o.members[0].additional_teacher_data.portfolio
							};
				delete o["members"];
				return o;
			}),
			meta: {
				total,
				limit,
				offset
			}
		};
	},

	create: async (data, transaction) => {
		return Course.create({ ...data, code: "TEMP" }, { transaction, include: createIncludeClause({}) });
	},

	update: async (oldObj, updateObj, transaction) => {
		return oldObj.update(updateObj, { transaction });
	},

	delete: async (id, transaction) => {
		return Course.destroy({ where: { id }, transaction });
	},

	findMyCourseSchedule: async (userId, transaction) => {
		const courseMember = await CourseMember.findAll({
			where: {
				user_id: userId,
				status: MEMBER_STATUS.APPROVED
			},
			transaction
		});
		const courseIds = courseMember.map((member) => member.course_id);
		const courses = await Course.findAll({
			where: {
				id: {
					[Op.in]: courseIds
				},
				start_date: {
					[Op.lte]: new Date()
				},
				end_date: {
					[Op.gte]: new Date()
				}
			},
			include: createIncludeClause({}),
			transaction
		});
		return courses;
	}
};

export default courseDto;
