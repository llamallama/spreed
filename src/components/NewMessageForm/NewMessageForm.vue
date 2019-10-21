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
		<div class="new-message">
			<form class="new-message-form">
				<button class="new-message-form__button icon-clip-add-file" />
				<button class="new-message-form__button icon-emoji-smile" />
				<AdvancedInput v-model="text" @submit="handleSubmit" />
				<button class="new-message-form__button icon-bell-outline" />
				<button type="submit" class="new-message-form__button icon-folder" @click.prevent="handleSubmit" />
			</form>
		</div>
	</div>
</template>

<script>
import AdvancedInput from './AdvancedInput/AdvancedInput'
import { postNewMessage } from '../../services/messagesService'
import { getCurrentUser } from '@nextcloud/auth'

export default {
	name: 'NewMessageForm',
	components: {
		AdvancedInput
	},
	data: function() {
		return {
			text: ''
		}
	},
	computed: {
		/**
		 * The current conversation token
		 *
		 * @returns {String}
		 */
		token() {
			return this.$route.params.token
		}
	},
	methods: {
		/**
		 * Create a temporary message that will be used until the
		 * actual message object is retrieved from the server
		 *
		 * @returns {Object}
		 */
		createTemporaryMessage() {
			const message = Object.assign({}, {
				id: this.createTemporaryMessageId(),
				actorDisplayName: getCurrentUser().displayName,
				actorId: getCurrentUser().uid,
				message: this.text,
				token: this.token,
				timestamp: 0
			})
			return message
		},
		/**
		 * Create a temporary ID that will be used until the actual
		 * message object is received from the server.
		 *
		 * @returns {String}
		 */
		createTemporaryMessageId() {
			const date = new Date()
			return `temp_${(date.getTime()).toString()}`
		},
		/**
		 * Sends the new message
		 */
		async handleSubmit() {
			if (this.text !== '') {
				const temporaryMessage = this.createTemporaryMessage()
				this.$store.dispatch('addTemporaryMessage', temporaryMessage)
				this.text = ''
				// Scrolls the message list to the last added message
				this.$nextTick(function() {
					document.querySelector('.scroller').scrollTop = document.querySelector('.scroller').scrollHeight
				})
				try {
					// Posts the message to the server
					const response = await postNewMessage(temporaryMessage)
					// If successful, deletes the temporary message from the store
					this.$store.dispatch('deleteMessage', temporaryMessage)
					// And adds the complete version of the message received
					// by the server
					this.$store.dispatch('processMessage', response.data.ocs.data)
				} catch (error) {
					console.debug(`error while submitting message ${error}`)
				}

			}
		}
	}
}
</script>

<style lang="scss" scoped>

.wrapper {
	border-top: 1px solid lightgray;
}

.new-message {
	margin: auto;
	width: 700px;
    position: sticky;
    position: -webkit-sticky;
    bottom: 0;
    background-color: white;
    &-form {
        display: flex;
        align-items: center;
        &__input {
            flex-grow: 1;
            border:none;
        }
        &__button {
            width: 44px;
            height: 44px;
            margin: auto;
            background-color: transparent;
            border: none;
        }
	}
}
</style>