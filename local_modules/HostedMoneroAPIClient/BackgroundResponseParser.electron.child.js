// Copyright (c) 2014-2019, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
"use strict"
//
const child_ipc = require('../Concurrency/ipc.electron.child')
//
const reporting_appVersion = process.argv[2]
if (typeof reporting_appVersion === 'undefined' || !reporting_appVersion) {
	throw "BackgroundResponseParser.electron.child.js requires argv[2] reporting_appVersion"
}
//
const response_parser_utils = require('../Pyrex-core-js/hostAPI/response_parser_utils')
const monero_keyImage_cache_utils = require('../Pyrex-core-js/monero_utils/monero_keyImage_cache_utils')
const coreBridge_promise = require('../Pyrex-core-js/monero_utils/MyMoneroCoreBridge')({});
//
// Declaring tasks:
//
const tasksByName =
{
	//
	// Accessors
	Parsed_AddressInfo: function(
		taskUUID,
		//
		data,
		address,
		view_key__private,
		spend_key__public,
		spend_key__private
	) {
		// console.time("Parsed_AddressInfo: " + taskUUID)
		coreBridge_promise.then(function(coreBridge_instance)
		{
			response_parser_utils.Parsed_AddressInfo__keyImageManaged(
				// key-image-managed - be sure to call DeleteManagedKeyImagesForWalletWith when you're done with them
				data,
				address,
				view_key__private,
				spend_key__public,
				spend_key__private,
				coreBridge_instance,
				function(err, returnValuesByKey)
				{
					// console.timeEnd("Parsed_AddressInfo: " + taskUUID)
					child_ipc.CallBack(taskUUID, err, returnValuesByKey)
				}
			)
		})
	},
	Parsed_AddressTransactions: function(
		taskUUID,
		//
		data,
		address,
		view_key__private,
		spend_key__public,
		spend_key__private
	) {
		// console.time("Parsed_AddressTransactions: " + taskUUID)
		coreBridge_promise.then(function(coreBridge_instance)
		{
			response_parser_utils.Parsed_AddressTransactions__keyImageManaged(
				// key-image-managed - be sure to call DeleteManagedKeyImagesForWalletWith when you're done with them
				data,
				address,
				view_key__private,
				spend_key__public,
				spend_key__private,
				coreBridge_instance,
				function(err, returnValuesByKey)
				{
					// console.timeEnd("Parsed_AddressTransactions: " + taskUUID)
					child_ipc.CallBack(taskUUID, err, returnValuesByKey)
				}
			)
		});
	},
	//
	// Imperatives
	DeleteManagedKeyImagesForWalletWith: function(
		taskUUID,
		//
		address
	) {
		// console.time("DeleteManagedKeyImagesForWalletWith: " + taskUUID)
		monero_keyImage_cache_utils.DeleteManagedKeyImagesForWalletWith(address)
		const err = null
		// console.timeEnd("DeleteManagedKeyImagesForWalletWith: " + taskUUID)
		child_ipc.CallBack(taskUUID, err, null)
	}
}
//
//
// Kicking off runtime:
//
child_ipc.InitWithTasks_AndStartListening(tasksByName, "BackgroundResponseParser.electron.child", reporting_appVersion)