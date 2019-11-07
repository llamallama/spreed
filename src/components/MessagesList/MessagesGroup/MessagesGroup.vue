<!--
  - @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @author Marco Ambrosini <marcoambrosini@pm.me>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
-->

<template>
	<div class="wrapper">
		<div class="messages__avatar">
			<AuthorAvatar v-if="!isSystemMessage"
				:author-type="actorType"
				:author-id="actorId"
				:display-name="actorDisplayName" />
		</div>
		<div class="messages">
			<Message
				v-for="(message, index) of messages"
				:key="message.id"
				v-bind="message"
				:is-first-message="index === 0"
				:actor-display-name="actorDisplayName"
				:show-author="!isSystemMessage"
				:is-temporary="message.timestamp === 0" />
		</div>
	</div>
</template>

<script>
import AuthorAvatar from './AuthorAvatar'
import Message from './Message/Message'

export default {
	name: 'MessagesGroup',
	components: {
		AuthorAvatar,
		Message,
	},
	props: {
		/**
		 * The message id.
		 */
		id: {
			type: Number,
			required: true,
		},
		/**
		 * The conversation token.
		 */
		token: {
			type: String,
			required: true,
		},
		/**
		 * The messages object.
		 */
		messages: {
			type: Array,
			required: true,
		},
	},

	computed: {
		/**
		 * The message actor type.
		 * @returns {string}
		 */
		actorType() {
			return this.messages[0].actorType
		},
		/**
		 * The message actor id.
		 * @returns {string}
		 */
		actorId() {
			return this.messages[0].actorId
		},
		/**
		 * The message actor display name.
		 * @returns {string}
		 */
		actorDisplayName() {
			const displayName = this.messages[0].actorDisplayName.trim()

			if (displayName === '' && this.actorType === 'guests') {
				return t('spreed', 'Guest')
			}

			if (displayName === '') {
				return t('spreed', '[Unknown user name]')
			}

			return displayName
		},
		/**
		 * Whether the given message is a system message
		 * @returns {bool}
		 */
		isSystemMessage() {
			return this.messages[0].systemMessage.length !== 0
		},
	},
}
</script>

<style lang="scss" scoped>
@import '../../../assets/variables';

.wrapper {
	max-width: $message-max-width;
	display: flex;
	margin: auto;
	padding: 0;
	&:focus {
		background-color: rgba(47, 47, 47, 0.068);
	}
}

.messages {
	flex: auto;
	display: flex;
	padding: 8px 0 8px 0;
	flex-direction: column;
	&__avatar {
		position: sticky;
		top: 44px;
		height: 52px;
		width: 52px;
		padding: 0 10px 10px 10px;
	}
}
</style>