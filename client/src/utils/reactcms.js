import { includes } from 'lodash';
import { slashDomain, POST_STATUSES, capitalizeFirstLetter } from './';
import store from '../';

import {
  MANAGE_CATEGORIES,

  PUBLISH_POSTS,
  EDIT_POSTS,
  EDIT_OTHERS_POSTS,
  EDIT_PUBLISHED_POSTS,

  DELETE_POSTS,
  DELETE_OTHERS_POSTS,
  DELETE_PUBLISHED_POSTS,

  PUBLISH_PAGES,
  EDIT_PAGES,
  EDIT_OTHERS_PAGES,
  EDIT_PUBLISHED_PAGES,

  DELETE_PAGES,
  DELETE_OTHERS_PAGES,
  DELETE_PUBLISHED_PAGES,
} from '../containers/capabilities';

function isCapable(user, post, capability, capability_others, capability_published) {
  if ( post ) {
    if ( post.author._id === user.id ) {
      return ( post.status === 'publish' ) ?
        includes(capability_published, user.role) :
        includes(capability, user.role);
    } else {
      return includes(capability_others, user.role);
    }
  } else {
    return includes(capability, user.role);
  }
}

export function isUserCapable(action, postType, user, post) {
  switch (`${action}_${postType}`) {
    case 'manage_category':
      return isCapable(user, null, MANAGE_CATEGORIES);

    case 'publish_post':
      return isCapable(user, null, PUBLISH_POSTS);
    case 'edit_post':
      return isCapable(user, post, EDIT_POSTS, EDIT_OTHERS_POSTS, EDIT_PUBLISHED_POSTS);
    case 'delete_post':
      return isCapable(user, post, DELETE_POSTS, DELETE_OTHERS_POSTS, DELETE_PUBLISHED_POSTS);

    case 'publish_page':
      return isCapable(user, null, PUBLISH_PAGES);
    case 'edit_page':
      return isCapable(user, post, EDIT_PAGES, EDIT_OTHERS_PAGES, EDIT_PUBLISHED_PAGES);
    case 'delete_page':
      return isCapable(user, post, DELETE_PAGES, DELETE_OTHERS_PAGES, DELETE_PUBLISHED_PAGES);

    default:
      return;
  }
}

export function onEditPost(type, _id, history, domain) {
  history.push(`${slashDomain(domain)}/admin/${type}/${_id}`);
}

export function getPostStatuses(type, user, post) {
  let filtered = POST_STATUSES;

  if ( !isUserCapable('publish', type, user, post) )
    filtered = filtered.filter(o => o.value !== 'publish');
  if ( !isUserCapable('edit', type, user, post) )
    filtered = filtered.filter(o => o.value !== 'draft');
  if ( !isUserCapable('delete', type, user, post) )
    filtered = filtered.filter(o => o.value !== 'trash');

  return filtered;
}

export function documentTitle(name) {
  const { sites, info: { domain } } = store.getState();
  const title = sites[domain].title;
  if (name) name = capitalizeFirstLetter(name);

  document.title = name ? `${name} - ${title}` : title;
};