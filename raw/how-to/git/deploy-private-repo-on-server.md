# Deploy a private repo on a server

1. Run the ssh-keygen procedure:

```sh
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. update the `config` file in your `~/.ssh/`, add:
```sh
Host repo-name
  Hostname github.com
  IdentityFile=~/.ssh/the_private_key # might need to modify this /home/opc/.ssh/the_private_key
```

3. add the content your `the_key.pub` to the deploy key of your repo: settings > Deploy keys > `Add deploy key`

4. clone your repo:
```sh
git clone git@repo-name:your-github-username/repo-name.git
```
