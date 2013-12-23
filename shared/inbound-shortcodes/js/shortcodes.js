

	// Row add function
	function row_add_callback()
			{
				var length = jQuery('.child-clone-row').length;
				//jQuery('.child-clone-row').last().attr('id', 'row-'+length);

				jQuery('.form-field-row-number').each(function(i){
					var addition = i + 1;
					jQuery(this).text(addition);
					jQuery(this).parent().attr('id', 'row-'+addition);
				});
				jQuery('.child-clone-row').each(function(i){
					var number = i + 1;
					var the_id = jQuery(this).attr('id');
					jQuery(this).find('input, select, textarea').each(function(i){
					var this_id = the_id.replace('row-', '');
					var current_name = jQuery(this).attr('name');
					var clean_name = current_name.replace(/_[a-zA-Z0-9]*$/g, "");
					jQuery(this).attr('name', clean_name + '_' + this_id);
					});
				});

				jQuery('.child-clone-row .minimize-class').not( "#row-" + length + " .minimize-class").addClass('tog-hide-it');
				jQuery('.child-clone-row-shrink').not( "#row-" + length + " .child-clone-row-shrink").text("Expand");
				InboundShortcodes.generate(); // runs refresh
				InboundShortcodes.generateChild();
				jQuery('.child-clone-row').last().find('input').first().focus(); // focus on new input
				//InboundShortcodes.updatePreview();
			}

	var InboundShortcodes = {
		getUrlVars: function() {
		    var vars = [], hash;
		    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		    for(var i = 0; i < hashes.length; i++)
		    {
		      hash = hashes[i].split('=');
		      vars.push(hash[0]);
		      vars[hash[0]] = hash[1];
		    }
		    return vars;
		  },
		getUrlVar: function(name) {
		    return InboundShortcodes.getUrlVars()[name];
		  },
		generate: function() {

			var output = jQuery('#_inbound_shortcodes_output').text(),
				newoutput = output;

			jQuery('.inbound-shortcodes-input').each(function() {
				var input = jQuery(this),
					theid = input.attr('id'),
					id = theid.replace('inbound_shortcode_', ''),
					re = new RegExp('{{'+id+'}}', 'g');

				if( input.is(':checkbox') ) {
					var val = ( jQuery(this).is(':checked') ) ? '1' : '0';
					newoutput = newoutput.replace(re, val);

				}
				else {
					newoutput = newoutput.replace(re, input.val());
				}
				// Add fix to remove empty params. maybe
				//console.log(newoutput);

			});

			jQuery('#_inbound_shortcodes_newoutput').remove();
			jQuery('#inbound-shortcodes-form-table').prepend('<div id="_inbound_shortcodes_newoutput" class="hidden">' + newoutput + '</div>');

			InboundShortcodes.updatePreview();

		},

		generateChild : function() {

			var output = jQuery('#_inbound_shortcodes_child_output').text(),
				parent_output = '',
				outputs = '';

			jQuery('.child-clone-row').each(function() {

				var row = jQuery(this),
					row_output = output;

				jQuery('.inbound-shortcodes-child-input', this).each(function() {
					var input = jQuery(this),
						theid = input.attr('id'),
						id = theid.replace('inbound_shortcode_', ''),
						re = new RegExp('{{'+id+'}}', 'g');

					if( input.is(':checkbox') ) {
						var val = ( jQuery(this).is(':checked') ) ? '1' : '0';
						row_output = row_output.replace(re, val);
					}
					else {
						row_output = row_output.replace(re, input.val());
					}
					//console.log(newoutput);
				});

				outputs = outputs + row_output + "\n";
			});

			jQuery('#_inbound_shortcodes_child_newoutput').remove();
			jQuery('.child-clone-rows').prepend('<div id="_inbound_shortcodes_child_newoutput" class="hidden">' + outputs + '</div>');

			this.generate();
			parent_output = jQuery('#_inbound_shortcodes_newoutput').text().replace('{{child}}', outputs);

			jQuery('#_inbound_shortcodes_newoutput').remove();
			jQuery('#inbound-shortcodes-form-table').prepend('<div id="_inbound_shortcodes_newoutput" class="hidden">' + parent_output + '</div>');

			InboundShortcodes.updatePreview();

		},


		children : function() {

			jQuery('.child-clone-rows').appendo({
				subSelect: '> div.child-clone-row:last-child',
				allowDelete: false,
				focusFirst: false,
				onAdd: row_add_callback
			});
			jQuery("body").on('click', '.child-clone-row', function () {
				var exlcude_id = jQuery(this).attr('id');
				console.log(exlcude_id);
				jQuery('.child-clone-row .minimize-class').not( "#" + exlcude_id + " .minimize-class").addClass('tog-hide-it');
				jQuery(this).find(".minimize-class").removeClass('tog-hide-it');
				jQuery(this).find('.child-clone-row-shrink').text("Minimize");
    		});
    		// Clone Field values
    		jQuery("body").on('click', '.child-clone-row-exact', function () {
    			var	btn = jQuery(this),
    			clone_box = btn.parent();
    			var new_clone = clone_box.clone();
    			jQuery(clone_box).after(new_clone);
    			row_add_callback();
    		});
    		// Shrink Rows
			jQuery("body").on('click', '.child-clone-row-shrink', function () {
				var	btn = jQuery(this),
				btn_class = btn.hasClass('shrunken'),
				row = btn.parent();
				console.log('clicked');
				if (btn_class === false ){
					console.log('nope.');
					btn.addClass('shrunken');
					row.find(".minimize-class").addClass('tog-hide-it');
					btn.text("Expand");
				} else {
					console.log('yep');
					btn.removeClass('shrunken');
					row.find(".minimize-class").removeClass('tog-hide-it');
					btn.text("minimize");
				}

				return false;
			});

			jQuery('.child-clone-row-remove').live('click', function() {
				var	btn = jQuery(this),
				row = btn.parent();


				if( jQuery('.child-clone-row').size() > 1 ){
					row.remove();
					row_add_callback();
				}
				else {
					alert('You need a minimum of one row');
				}
				return false;
			});


			jQuery('.child-clone-rows').sortable({
				placeholder: 'sortable-placeholder',
				items: '.child-clone-row',
				stop: row_add_callback
			});

		},

		updatePreview : function() {

			if( jQuery('#inbound-shortcodes-preview').size() > 0 ) {

				var	shortcode = jQuery('#_inbound_shortcodes_newoutput').html(),
					iframe = jQuery('#inbound-shortcodes-preview'),
					theiframeSrc = iframe.attr('src'),
					thesiframeSrc = theiframeSrc.split('preview.php'),
					shortcode_name = jQuery("#inbound_current_shortcode").val(),
					form_id = jQuery("#post_ID").val(),
					iframeSrc = thesiframeSrc[0] + 'preview.php';
				// Add form id to CPT preview
				if ( shortcode_name === "insert_inbound_form_shortcode") {
					if (typeof (inbound_forms) != "undefined" && inbound_forms !== null) {
						var shortcode = shortcode.replace('[inbound_form', '[inbound_form id="'+form_id+'"');
					}
				}
				if ( shortcode_name === "insert_styled_list_shortcode" || shortcode_name === "insert_button_shortcode") {
						var shortcode = shortcode.replace(/#/g, '');
				}
				// updates the src value
				iframe.attr( 'src', iframeSrc + '?post='+inbound_shortcodes.form_id+'&sc=' + InboundShortcodes.htmlEncode(shortcode));

				//console.log('updated iframe');
				// update the height
				//jQuery('#inbound-shortcodes-preview').height( jQuery('#inbound-shortcodes-popup').outerHeight()-72 );


			}

		},

		resizeTB : function() {

			var	ajaxCont = jQuery('#TB_ajaxContent'),
				tbWindow = jQuery('#TB_window'),
				freshthemesPopup = jQuery('#inbound-shortcodes-popup'),
				no_preview = (jQuery('#_inbound_shortcodes_preview').text() == 'false') ? true : false;
			var width = jQuery(window).width();
			var H = jQuery(window).height();
			var W = ( 1720 < width ) ? 1720 : width;
			var this_height = ajaxCont.height();
			console.log(this_height);

				ajaxCont.css({
					padding: 0,
					// height: (tbWindow.outerHeight()-47),
					height: freshthemesPopup.outerHeight()-15,
					overflow: 'scroll' // IMPORTANT
				});
				// full screen fix
				if ( tbWindow.size() ) {
				tbWindow.width( W - 150 ).height( H - 75 );
				ajaxCont.width( W - 150 ).height( H - 95 );
				tbWindow.css({'margin-left': '-' + parseInt((( W - 150 ) / 2),10) + 'px'});

				if ( typeof document.body.style.maxWidth != 'undefined' )
					tbWindow.css({'top':'40px','margin-top':'0'});
				//jQuery('#TB_title').css({'background-color':'#fff','color':'#cfcfcf'});
				};
				// Old css
				/*tbWindow.css({
					width: ajaxCont.outerWidth(),
					height: (ajaxCont.outerHeight() + 30),
					marginLeft: -(ajaxCont.outerWidth()/2),
					marginTop: -((ajaxCont.outerHeight() + 47)/2),
					top: '50%'
				}); */


		},
		fill_form_fields: function(){
		            var SelectionData = jQuery("#cpt-form-serialize").text();
		            if (SelectionData != "") {

		                jQuery.each(SelectionData.split('&'), function (index, elem) {
		                    var vals = elem.split('=');

		                    var $select_val = jQuery('select[name="'+vals[0]+'"]').attr('name');
		                    var $select = jQuery('select[name="'+vals[0]+'"]');
		                    var $input = jQuery('input[name="'+vals[0]+'"]'); // input vals
		                    var input_type = jQuery('input[name="'+vals[0]+'"]').attr('type');
		                    var $checkbox = jQuery('input[name="'+vals[0]+'"]'); // input vals
		                    var $textarea = jQuery('textarea[name="'+vals[0]+'"]'); // input vals
		                    var separator = '';
		                    /*if ($div.html().length > 0) {
		                        separator = ', ';
		                    }*/
		                    //console.log(input_type);
		                    $input.val(decodeURIComponent(vals[1].replace(/\+/g, ' ')));
		                    if (input_type === 'checkbox' && vals[1] === 'on'){
		                        $input.prop( "checked", true );
		                    }
		                    if ($select_val != 'inbound_shortcode_insert_default'){
		                    $select.val(decodeURIComponent(vals[1].replace(/\+/g, ' ')));
		                    }
		                    $textarea.val(decodeURIComponent(vals[1].replace(/\+/g, ' ')));
		                   });

		            }
		    },
			update_fields : function () {
							var insert_form = jQuery("#inbound_shortcode_insert_default").val();
							var current_code = jQuery("#inbound_current_shortcode").val();
							if ( current_code === "quick_insert_inbound_form_shortcode") {
								return false;
							}

							var patt = /^form_/gi;
							var result = patt.test(insert_form);
							if (result === false){

								var form_insert = window[insert_form];
								if (typeof (form_insert) != "undefined" && form_insert != null && form_insert != "") {
									var fields = form_insert.form_fields;
									var field_count = form_insert.field_length;
								} else {
									var fields = "";
									var field_count = 1;
								}

								if (jQuery('.child-clone-row').length != "1") {
									if (confirm('Are you sure you want to overwrite the current form you are building? Selecting another form template will clear your current fields/settings')) {
										//jQuery(".child-clone-rows.ui-sortable").html(form_insert); // old dom junk
										jQuery("#cpt-form-serialize").text(fields);
				            			jQuery(".child-clone-row").remove(); // clear old fields
				            			var i = 0;
				            			while (i<field_count) {
				            			  jQuery("#form-child-add").click();
				            			  i++;
				            			}
				            			InboundShortcodes.fill_form_fields();
				        			} else {
				        				jQuery("#inbound_shortcode_insert_default").val(jQuery.data(this, 'current')); // added parenthesis (edit)
			            				return false;
				        			}
		        				} else {
		        											jQuery("#cpt-form-serialize").text(fields);
		        					            			jQuery(".child-clone-row").remove(); // clear old fields
		        					            			var i = 0;
		        					            			while (i<field_count) {
		        					            			  jQuery("#form-child-add").click();
		        					            			  i++;
		        					            			}
		        					            			InboundShortcodes.fill_form_fields();
		        				}
							//jQuery.data("#inbound_shortcode_insert_default", 'current', jQuery("#inbound_shortcode_insert_default").val());

							} else {
								var form_insert = 'custom';
								var form_id = insert_form.replace('form_', '');

								//run ajax
								jQuery.ajax({
						            type: 'POST',
						            url: ajaxurl,
						            context: this,
						            data: {
						                action: 'inbound_form_get_data',
						                form_id: form_id
						            },

						            success: function (data) {
						                var self = this;
						                var str = data;

						                // If form name already exists
						                var obj = JSON.parse(str);
						                //console.log(obj);
							            var field_count = obj.field_count;
							            console.log(field_count);
							            var i = 1;
							            var form_values = obj.field_values;
							            var form_insert = obj.form_settings_data;
							            jQuery("#cpt-form-serialize").text(form_values);
							            // Stop form overwrites from happening
							            if (jQuery('.child-clone-row').length != "1") {
											if (confirm('Are you sure you want to overwrite the current form you are building? Selecting another form template will clear your current fields/settings')) {
						            			  //jQuery(".child-clone-rows.ui-sortable").html(form_insert); // old insert method
						            			  // new method
						            			  jQuery(".child-clone-row").remove(); // clear old fields
						            			  var i = 0;
						            			  while (i<field_count) {
						            			    jQuery("#form-child-add").click();
						            			    i++;
						            			  }
						            			  InboundShortcodes.fill_form_fields();
						            			  jQuery("#_inbound_shortcodes_newoutput").text(obj.inbound_shortcode);
						            			  	InboundShortcodes.generate();
													InboundShortcodes.generateChild();
						        			} else {
						        				jQuery(this).val(jQuery.data(this, 'current')); // added parenthesis (edit)
					            				return false;
						        			}

				        				} else {
				        				 //jQuery(".child-clone-rows.ui-sortable").html(form_insert); // old insert method
				        				 // new method
				        				 //jQuery(".child-clone-row").remove(); // clear old fields
				        				 while (i<field_count){
				        				    jQuery("#form-child-add").click();
				        				    i++;
				        				  }
				        				  InboundShortcodes.fill_form_fields();
				        				  jQuery("#_inbound_shortcodes_newoutput").text(obj.inbound_shortcode);
				        				  InboundShortcodes.generate();
										  InboundShortcodes.generateChild();
				        				}

						            	jQuery.data(this, 'current', jQuery(this).val());
						                /*var worked = '<span class="lp-success-message">Form Changed</span>';
						                var s_message = jQuery(self).parent();
						                jQuery(worked).appendTo(s_message); */
						                 // runs refresh


						            },

						            error: function (MLHttpRequest, textStatus, errorThrown) {
						                alert("Ajax not enabled");
						            }

					       	 	 });

								 return form_insert;
					    	}

						},
		load : function() {

			var	InboundShortcodes = this,
				popup = jQuery('#inbound-shortcodes-popup'),
				form = jQuery('#inbound-shortcodes-form', popup),
				output = jQuery('#_inbound_shortcodes_output', form).text(),
				popupType = jQuery('#_inbound_shortcodes_popup', form).text(),
				shortcode_name = jQuery("#inbound_current_shortcode").val(),
				newoutput = '';

			InboundShortcodes.resizeTB();
			jQuery(window).resize(function() {
				InboundShortcodes.resizeTB();
			});

			InboundShortcodes.generate();
			InboundShortcodes.children();
			InboundShortcodes.generateChild();
			jQuery("#inbound-shortcodes-popup").addClass('shortcode-' + shortcode_name);
			// Conditional Form Only extras
			if ( shortcode_name === "insert_inbound_form_shortcode") {
				jQuery("#inbound_insert_shortcode_two, .inbound_shortcode_child_tbody, .main-design-settings").hide();
				jQuery("#inbound_save_form").show();
				jQuery("#inbound_insert_shortcode_two").removeClass('button-primary').addClass('button').text('Insert Full Shortcode')
				jQuery('.step-item').on('click', function() {
				  jQuery(this).addClass('active').siblings().removeClass('active');
				  var show = jQuery(this).attr('data-display-options');
				  jQuery('.inbound_tbody').hide();
				  jQuery(show).show();
				});
				// Insert default forms
				jQuery('body').on('change', '#inbound_shortcode_insert_default', function () {

					InboundShortcodes.update_fields();
				});
				jQuery("body").on('click', '.switch-to-form-insert', function () {
					tb_show( inbound_load.pop_title, inbound_load.image_dir + 'popup.php?popup=quick-forms&width=' + 900);
				 });
			}
			if (shortcode_name === 'insert_button_shortcode' || shortcode_name === 'insert_styled_list_shortcode' || shortcode_name === "insert_inbound_form_shortcode"){

				function format(state) {
				           if (!state.id) return state.text; // optgroup
				           return "<i class='fa-" + state.id.toLowerCase() + " inbound-icon-padding'></i>" + state.text + '';
				       }
				       jQuery("#inbound_shortcode_icon").select2({
				       	placeholder: "Select an icon for the button",
				       	allowClear: true,
				           formatResult: format,
				           formatSelection: format,
				           escapeMarkup: function(m) { return m; }
				       });
			}
			if (shortcode_name === 'insert_styled_list_shortcode'){


				setTimeout(function() {
					//jQuery("#inbound_shortcode_icon").val("ok-circle").select2();
				             //jQuery("#inbound_shortcode_icon").select2("open");
				        }, 500);
			}
			if (shortcode_name === 'insert_call_to_action'){


				       jQuery("#insert_inbound_cta").select2({
				       		placeholder: "Select one or more calls to action to rotate through",

				       });
				       setTimeout(function() {
				                     jQuery("#insert_inbound_cta").select2("open");
				               }, 500);
				       jQuery("body").on('change', '#insert_inbound_cta', function () {
				       	var cta_ids = jQuery("#insert_inbound_cta").select2("data");
				       	var cta_val = jQuery("#insert_inbound_cta").select2("val");
				       //	alert("Selected value is: "+jQuery("#insert_inbound_cta").select2("data"));
				       	var cta_id_array = new Array();

				       	jQuery.each(cta_ids, function(key,valueObj){

				       	    var the_id = valueObj['id'];
				       	    cta_id_array.push(the_id);
				       	});

				       	console.log(cta_id_array);
				       	var final_ids = cta_id_array.join();
				       	setTimeout(function() {
				       	jQuery("#_inbound_shortcodes_newoutput").html('[cta id="'+final_ids+'"]');
				       	        }, 1000);
				           });
			}
			if ( shortcode_name === "quick_insert_inbound_form_shortcode") {
				jQuery("#inbound_insert_shortcode_two").addClass('quick-forms');

				jQuery("body").on('click', '.switch-to-form-builder', function () {
					tb_show( inbound_load.pop_title, inbound_load.image_dir + 'popup.php?popup=forms&width=' + 900 + "&path=" + inbound_load.image_dir);
				 });

				jQuery('#inbound_shortcode_insert_default option').each(function(){
					var option_name = jQuery(this).val();
					var option_fix = option_name.replace('form_', '');
					jQuery(this).val(option_fix);
					if (option_name === "none") {
						jQuery(this).text('Choose Form');
					}
				});
				row_add_callback();
				// Insert default forms
				jQuery('body').on('change', '#inbound_shortcode_insert_default', function () {
					var val = jQuery(this).val();
					var option = jQuery(this).find("option[value='"+val+"']").text();
					jQuery('#inbound_shortcode_form_name').val(option);
					InboundShortcodes.update_fields();
				});
			}



			// Save Shortcode Function
			var shortcode_nonce_val = inbound_shortcodes.inbound_shortcode_nonce; // NEED CORRECT NONCE
			jQuery("body").on('mousedown', '#inbound_save_form', function () {

			        var post_id = jQuery("#post_ID").val();
			      	var form_settings = jQuery(".child-clone-rows.ui-sortable").html();
			        var shortcode_name = jQuery("#inbound_current_shortcode").val();
			        var shortcode_value = jQuery('#_inbound_shortcodes_newoutput').html();
					var form_name = jQuery("#inbound_shortcode_form_name").val();
					var form_values = jQuery("#inbound-shortcodes-form").serialize();
					var notify_email = jQuery("#inbound_shortcode_notify").val();
					var field_count = jQuery('.child-clone-row').length;
					var redirect_value = jQuery('#inbound_shortcode_redirect').val();

					if (typeof (inbound_forms) != "undefined" && inbound_forms !== null) {
						var post_type = 'inbound-forms';
						var send_email = jQuery("#inbound_email_send_notification").val();
						var send_email_subject = jQuery("#inbound_confirmation_subject").val();
						var email_contents = jQuery("#content_ifr").contents().find('body').html(); // email responder
					} else {
						var post_type = 'normal';
						var send_email = 'off';
						var send_email_subject = '';
						var email_contents = ''; // if post created on other post
					}
					if ( shortcode_name === "insert_inbound_form_shortcode" && form_name == "") {
						jQuery(".step-item.first").click();
						alert("Please Insert a Form Name!");
						jQuery("#inbound_shortcode_form_name").addClass('need-value').focus();
					} else {
			        jQuery.ajax({
			            type: 'POST',
			            url: ajaxurl,
			            context: this,
			            data: {
			                action: 'inbound_form_save',
			                name: form_name,
			                shortcode: shortcode_value,
			                field_count: field_count,
			                form_values: form_values,
			                notify_email: notify_email,
			                send_email: send_email,
			                send_subject: send_email_subject,
			               	form_settings: form_settings,
			                post_id: post_id,
			                post_type: post_type,
			                email_contents: email_contents,
			                redirect_value: redirect_value,
			                nonce: shortcode_nonce_val
			            },

			            success: function (data) {
			                var self = this;

						    console.log(data);
			                var str = data;
			                // If form name already exists
			                if (str === "\"Found\"") {
			                	alert("A Form by this name already exists. Please choose another name or select your existing form from the dropdown");
			                	 return false;
			                }
			                // If form name already exists
			                var obj = JSON.parse(str);
			                console.log(obj);


				            var form_id = obj.post_id;
				            var final_form_name = obj.form_name;

			                //var post_id_final = new_post.replace('"', '');
			                var site_base = window.location.origin + '/wp-admin/post.php?post=' + form_id + '&action=edit';
			                // jQuery('.lp-form').unbind('submit').submit();
			                //var worked = '<span class="success-message-map">Success! ' + this_meta_id + ' set to ' + meta_to_save + '</span>';
			                var worked = '<span class="lp-success-message">Form Created & Saved</span><a style="padding-left:10px;" target="_blank" href="' + site_base  +'" class="event-view-post">View/Edit Form</a>';

			                var final_short_form = '[inbound_forms id="' + form_id + '" name="'+final_form_name+'"]';
			                if (typeof (inbound_forms) != "undefined" && inbound_forms !== null) {
			                   jQuery(self).text('Form Updated').css('font-size', '25px');
			                   var draft = jQuery("#hidden_post_status").val();
			                   if (draft === 'draft') {
			                       window.location.href = window.location.origin + '/wp-admin/post.php?post=' + form_id + '&action=edit&reload=true'
			                     }
			                   setTimeout(function() {
			                            jQuery(self).text('Save Form').css('font-size', '17px');
			                           }, 5000);
			                } else {
			                	// set correct ID for insert
			                	var insert_to = jQuery.cookie('inbound_shortcode_editor_name');
			                	 window.tinyMCE.execInstanceCommand(insert_to, 'mceInsertContent', false, final_short_form);
			                	//window.tinyMCE.activeEditor.execCommand('mceInsertContent', false, output_cleaned);
			                	/* Fix for editor not recognizing shortcode' */
			                	var chtml= jQuery('#' + insert_to + '-html');
			                	var ctmce= jQuery('#' + insert_to + '-tmce');
			                	switchEditors.switchto(chtml[0]); // switch to html

			                	tb_remove();
			                	jQuery('html, body').animate({
			                	       scrollTop: jQuery("#" + insert_to + "_InboundShortcodesButton_action").offset().top -200
			                	   }, 200);
			                	switchEditors.switchto(ctmce[0]); // switch to tinymce
			                }

			                //jQuery(worked).appendTo(s_message);
			                //jQuery(self).hide();
			                //alert("Event Created");
			            },

			            error: function (MLHttpRequest, textStatus, errorThrown) {
			                alert("Ajax not enabled");
			            }
			        });
			     }
			        return false;
			});

			jQuery('body').on('change, keyup', '.inbound-shortcodes-child-input', function() {
				InboundShortcodes.generateChild(); // runs refresh for children
				var update_dom = jQuery(this).val();
				jQuery(this).attr('value', update_dom);
			});

			jQuery('.inbound-shortcodes-input', form).on('change, keyup', function () {
				var exclude_input = jQuery(this).parent().parent().parent().parent().hasClass('exclude-from-refresh');
				console.log('yes');
				console.log(exclude_input);
				if (exclude_input != 'true'){
				InboundShortcodes.generate(); // runs refresh
				InboundShortcodes.generateChild();
			}
				var update_dom = jQuery(this).val();
				jQuery(this).attr('value', update_dom);
			});

			jQuery('body').on('change', 'input[type="checkbox"], input[type="radio"], input[type="color"], select', function () {
				var exclude_input = jQuery(this).parent().parent().parent().parent().hasClass('exclude-from-refresh');
				if (exclude_input != 'true'){
					InboundShortcodes.generateChild(); // runs refresh for fields
				}

				var input_type = jQuery(this).attr('type');
				var update_dom = jQuery(this).val();
				if (input_type === "checkbox") {
					var checked = jQuery(this).is(":checked");
					if (checked === true){
					  jQuery(this).attr('checked',true);
					} else {
						jQuery(this).removeAttr( "checked" );
					}

				} else if (input_type === "radio") {

				} else {
					jQuery(this).find("option").removeAttr( "selected" );
					jQuery(this).find("option[value='"+update_dom+"']").attr('selected', update_dom);

				}

			});

			jQuery("body").on('click', '.show-advanced-fields', function () {

					jQuery(this).parent().parent().parent().parent().find(".inbound-tab-class-advanced").show();
					jQuery(this).removeClass("show-advanced-fields");
					jQuery(this).addClass("hide-advanced-options");
					jQuery(this).text("Hide advanced options");

    		});
    		jQuery("body").on('click', '.hide-advanced-options', function () {

					jQuery(this).parent().parent().parent().parent().find(".inbound-tab-class-advanced").hide();
					jQuery(this).removeClass("hide-advanced-options");
					jQuery(this).text("Show advanced options");
					jQuery(this).addClass("show-advanced-fields");

    		});

			jQuery('body').on('change', 'select', function () {
				var find_this = jQuery(this).attr('data-field-name'),
				exclude_status = jQuery(this).hasClass('exclude'),
				this_val = jQuery(this).val();
				var parent_el = jQuery(this).parent().parent().parent();

				if (exclude_status != true){
					jQuery(parent_el).find(".dynamic-visable-on").hide();
					jQuery(parent_el).find('.reveal-' + this_val).removeClass('inbound-hidden-row').show().addClass('dynamic-visable-on');
				}
			});
			setTimeout(function() {

			jQuery('.inbound_shortcode_child_tbody select').each(function(){
				var find_this = jQuery(this).attr('data-field-name'),
				exclude_status = jQuery(this).hasClass('exclude'),
				this_val = jQuery(this).val();
				var parent_el = jQuery(this).parent().parent().parent();

				if (exclude_status != true){
					jQuery(parent_el).find(".dynamic-visable-on").hide();
					jQuery(parent_el).find('.reveal-' + this_val).removeClass('inbound-hidden-row').show().addClass('dynamic-visable-on');
				}
			});
			}, 2000);
    		jQuery("body").on('click', '.inbound-shortcodes-insert-cancel', function () {
    			window.tb_remove();
    		});

		},
		insert_shortcode: function() {
				var shortcode_name = jQuery("#inbound_current_shortcode").val();
				var form_name = jQuery("#inbound_shortcode_form_name").val();
				if ( shortcode_name === "insert_inbound_form_shortcode" && form_name == "") {
					jQuery(".step-item.first").click();
					alert("Please Insert a Form Name!");
					jQuery("#inbound_shortcode_form_name").addClass('need-value').focus();
				} else {
					if(window.tinyMCE) {
							var insert_val = jQuery('#_inbound_shortcodes_newoutput').html();

							if ( shortcode_name === "insert_inbound_form_shortcode" || shortcode_name === "insert_styled_list_shortcode") {
							//var fixed_insert_val = insert_val.replace(/\[.*?(.*?)\]/g, "[$1]<br class='inbr'/>"); // for linebreaks in editor
							var fixed_insert_val = insert_val.replace(/\[.*?(.*?)\]/g, "<p>[$1]</p>"); // cleans output in editor
							output_cleaned = fixed_insert_val.replace(/[a-zA-Z0-9_]*=""/g, ""); // remove empty shortcode fields
							//output_cleaned = "<!-- Beginning of Form Embed -->" + output_cleaned + "<!-- End of Form Embed -->";
							} else if (shortcode_name === "insert_column_shortcode") {
								var output_cleaned = insert_val;
								//output_cleaned = fixed_insert_val.replace(/\[\/(.*?)\]/g, "[$1]<br class='inbr'/>");
							} else {
							var fixed_insert_val = insert_val;
							output_cleaned = fixed_insert_val.replace(/[a-zA-Z0-9_]*=""/g, ""); // remove empty shortcode fields
							}
							// set correct ID for insert
							var insert_to = jQuery.cookie('inbound_shortcode_editor_name');
							 window.tinyMCE.execInstanceCommand(insert_to, 'mceInsertContent', false, output_cleaned);
							//window.tinyMCE.activeEditor.execCommand('mceInsertContent', false, output_cleaned);
							/* Fix for editor not recognizing shortcode' */
							var chtml= jQuery('#' + insert_to + '-html');
							var ctmce= jQuery('#' + insert_to + '-tmce');
							switchEditors.switchto(chtml[0]); // switch to html

							tb_remove();
							jQuery('html, body').animate({
							       scrollTop: jQuery("#" + insert_to + "_InboundShortcodesButton_action").offset().top -200
							   }, 200);
							switchEditors.switchto(ctmce[0]); // switch to tinymce
					}
				}
			},

		htmlEncode: function(html) {
			return jQuery('<div/>').text(html).html();
		}

	};

	jQuery(document).ready( function() {
		jQuery('#inbound-shortcodes-popup').livequery( function() {
			InboundShortcodes.load();
		});
		jQuery("body").on('click', '.inbound-shortcodes-insert-two', function () {
			InboundShortcodes.insert_shortcode();
		});
		// Shortcode editor insert fix
		jQuery("body").on('mouseenter', '.mceAction.mce_InboundShortcodesButton', function () {

		        var editor_name = jQuery(this).attr('id');
		        if (typeof (editor_name) != "undefined" && editor_name != null && editor_name != "") {
		        	editor_name = editor_name.replace('_InboundShortcodesButton_action','');
		        } else {
		        	return false;
		        }

		        console.log(editor_name);
		        jQuery.cookie('inbound_shortcode_editor_name', editor_name);
		        //jQuery.cookie('media_init', 1);
		       // tb_show('', 'media-upload.php?type=image&type=image&amp;TB_iframe=true');
		        return false;
		    }
		 );
		if (InboundShortcodes.getUrlVar("reload") === 'true') {

			jQuery("#post-body-content").hide();
			var window_url = window.location.href.replace('&reload=true', "");
			jQuery("#post-body").before('<h2>Please Refresh this Page to Edit your Form<h2><a href="'+window_url+'">Click to Refresh</a>');

			window.history.replaceState({}, document.title, window_url);
		}
	});

