# Test fixtures for the Glowing Bear relay integration tests.
#
# Creates the buffer python.gbtest, a channel with a nicklist, and the
# command /gbtest to change it:
#   /gbtest nick add|del <nick> [group]
#   /gbtest nick prefix <nick> <prefix>
#   /gbtest group add|del <group>
#   /gbtest group hide <group>
#   /gbtest say <nick> <text...>
#   /gbtest color
#   /gbtest edit <text...>     (change the last line, buffer_line_data_changed)
import weechat

weechat.register("gbtest", "glowing-bear", "1.0", "GPL3", "Glowing Bear test fixtures", "", "")

buf = weechat.buffer_new("gbtest", "", "", "", "")
weechat.buffer_set(buf, "short_name", "#gbtest")
weechat.buffer_set(buf, "title", "Test \x19F04red\x1c title https://weechat.org")
weechat.buffer_set(buf, "localvar_set_type", "channel")
weechat.buffer_set(buf, "localvar_set_server", "gbnet")
weechat.buffer_set(buf, "localvar_set_nick", "gbuser")
weechat.buffer_set(buf, "highlight_words", "gbuser")
weechat.buffer_set(buf, "nicklist", "1")
ops = weechat.nicklist_add_group(buf, "", "000|o", "weechat.color.nicklist_group", 1)
users = weechat.nicklist_add_group(buf, "", "999|...", "weechat.color.nicklist_group", 1)
weechat.nicklist_add_nick(buf, ops, "alice", "cyan", "@", "lightgreen", 1)
weechat.nicklist_add_nick(buf, users, "gbuser", "weechat.color.chat_nick_self", " ", "", 1)


def group(name):
    return weechat.nicklist_search_group(buf, "", name) or users


def cmd_cb(data, buffer, args):
    argv = args.split()
    if argv[:2] == ["nick", "add"]:
        weechat.nicklist_add_nick(buf, group(argv[3] if len(argv) > 3 else ""), argv[2],
                                  "yellow", "", "", 1)
    elif argv[:2] == ["nick", "del"]:
        weechat.nicklist_remove_nick(buf, weechat.nicklist_search_nick(buf, "", argv[2]))
    elif argv[:2] == ["nick", "prefix"]:
        weechat.nicklist_nick_set(buf, weechat.nicklist_search_nick(buf, "", argv[2]),
                                  "prefix", argv[3])
    elif argv[:2] == ["group", "add"]:
        weechat.nicklist_add_group(buf, "", argv[2], "weechat.color.nicklist_group", 1)
    elif argv[:2] == ["group", "del"]:
        weechat.nicklist_remove_group(buf, weechat.nicklist_search_group(buf, "", argv[2]))
    elif argv[:2] == ["group", "hide"]:
        weechat.nicklist_group_set(buf, weechat.nicklist_search_group(buf, "", argv[2]),
                                   "visible", "0")
    elif argv[0] == "say":
        weechat.prnt_date_tags(buf, 0, "irc_privmsg,notify_message,nick_%s,log1" % argv[1],
                               "%s\t%s" % (argv[1], " ".join(argv[2:])))
    elif argv[0] == "color":
        weechat.prnt_date_tags(buf, 0, "irc_privmsg,notify_message,nick_alice,log1",
                               "alice\t%snormal %sgreen %sbold%s back"
                               % (weechat.color("reset"), weechat.color("green"),
                                  weechat.color("bold"), weechat.color("reset")))
    elif argv[0] == "edit":
        own_lines = weechat.hdata_pointer(weechat.hdata_get("buffer"), buf, "own_lines")
        last_line = weechat.hdata_pointer(weechat.hdata_get("lines"), own_lines, "last_line")
        data = weechat.hdata_pointer(weechat.hdata_get("line"), last_line, "data")
        weechat.hdata_update(weechat.hdata_get("line_data"), data,
                             {"message": " ".join(argv[1:])})
    return weechat.WEECHAT_RC_OK


weechat.hook_command("gbtest", "Glowing Bear test fixtures", "", "", "", "cmd_cb", "")
for i in range(40):
    weechat.prnt_date_tags(buf, 0, "irc_privmsg,notify_message,nick_alice,log1",
                           "alice\thistory line %d" % i)
