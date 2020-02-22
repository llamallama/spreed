/**
 * @copyright Copyright (c) 2019 Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @author Marco Ambrosini <marcoambrosini@pm.me>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
import axios from '@nextcloud/axios'
import { generateOcsUrl } from '@nextcloud/router'

/**
 * Appends a file as a message to the messagelist.
 * @param {string} path The file path from the user's root directory
 * e.g. `/myfile.txt`
 * @param {string} token The conversation's token
 * @returns {object} the response object
 */
const shareFileToRoom = (path, token) => {
	const response = axios.post(
		generateOcsUrl('apps/files_sharing/api/v1', 2) + 'shares',
		{
			shareType: 10, // OC.Share.SHARE_TYPE_ROOM,
			path: path,
			shareWith: token,
		})
	return response
}

export {
	shareFileToRoom
}