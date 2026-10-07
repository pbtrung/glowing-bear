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

# A server with a busy channel and a private chat, to look like IRC
server = weechat.buffer_new("server.gbnet", "", "", "", "")
weechat.buffer_set(server, "short_name", "gbnet")
weechat.buffer_set(server, "localvar_set_type", "server")
weechat.buffer_set(server, "localvar_set_server", "gbnet")
for name, short, kind in (("gbtest", "#gbtest", "channel"), ("random", "#random", "channel"),
                          ("bob", "bob", "private")):
    target = buf if name == "gbtest" else weechat.buffer_new(name, "", "", "", "")
    weechat.buffer_set(target, "short_name", short)
    weechat.buffer_set(target, "localvar_set_type", kind)
    weechat.buffer_set(target, "localvar_set_server", "gbnet")
    weechat.buffer_set(target, "localvar_set_plugin", "python")
weechat.buffer_set(server, "localvar_set_plugin", "python")
random = weechat.buffer_search("python", "random")
weechat.buffer_set(random, "title", "Off-topic chatter")
weechat.buffer_set(random, "nicklist", "1")
r_ops = weechat.nicklist_add_group(random, "", "000|o", "weechat.color.nicklist_group", 1)
r_voice = weechat.nicklist_add_group(random, "", "002|v", "weechat.color.nicklist_group", 1)
r_users = weechat.nicklist_add_group(random, "", "999|...", "weechat.color.nicklist_group", 1)
colors = ["cyan", "yellow", "lightgreen", "lightmagenta", "lightblue", "brown", "lightred"]
for i, nick in enumerate(["carol", "dave", "erin", "frank", "grace", "heidi", "ivan", "judy",
                          "mallory", "niaj", "olivia", "peggy", "rupert", "sybil", "trent",
                          "victor", "walter", "_xavier", "[yasmin]", "zoe", "Amelie", "Bruno",
                          "Chen", "Dmitri", "Élodie", "Farid", "Gustavo", "Hiro", "Ingrid",
                          "Jamal"]):
    if i < 2:
        weechat.nicklist_add_nick(random, r_ops, nick, colors[i % 7], "@", "lightgreen", 1)
    elif i < 5:
        weechat.nicklist_add_nick(random, r_voice, nick, colors[i % 7], "+", "yellow", 1)
    else:
        weechat.nicklist_add_nick(random, r_users, nick, colors[i % 7], " ", "", 1)
for i in range(5):
    weechat.prnt_date_tags(random, 0, "irc_privmsg,notify_message,nick_carol,log1",
                           "carol\trandom message %d" % i)
bob = weechat.buffer_search("python", "bob")
weechat.prnt_date_tags(bob, 0, "irc_privmsg,notify_private,nick_bob,log1", "bob\thi there!")


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
